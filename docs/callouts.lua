-- callouts.lua
-- Pandoc Lua filter to render Obsidian-style callouts (> [!NOTE] Title)
-- as beautifully formatted boxes in LaTeX/PDF and HTML outputs.
--
-- Based on the Obsidian Pandoc callout filter pattern:
-- https://forum.obsidian.md/t/rendering-callouts-similarly-in-pandoc/40020/5

local stringify = (require "pandoc.utils").stringify

-- Map of callout types to their theme colors, default titles, and labels
local callout_map = {
  note        = { color = "callout-note",     title = "Note" },
  info        = { color = "callout-info",     title = "Info" },
  todo        = { color = "callout-info",     title = "To-Do" },
  tip         = { color = "callout-tip",      title = "Tip" },
  hint        = { color = "callout-tip",      title = "Hint" },
  important   = { color = "callout-tip",      title = "Important" },
  success     = { color = "callout-success",  title = "Success" },
  check       = { color = "callout-success",  title = "Check" },
  done        = { color = "callout-success",  title = "Done" },
  question    = { color = "callout-question", title = "Question" },
  help        = { color = "callout-question", title = "Help" },
  faq         = { color = "callout-question", title = "FAQ" },
  warning     = { color = "callout-warning",  title = "Warning" },
  caution     = { color = "callout-caution",  title = "Caution" },
  attention   = { color = "callout-warning",  title = "Attention" },
  failure     = { color = "callout-danger",   title = "Failure" },
  fail        = { color = "callout-danger",   title = "Fail" },
  missing     = { color = "callout-danger",   title = "Missing" },
  danger      = { color = "callout-danger",   title = "Danger" },
  error       = { color = "callout-danger",   title = "Error" },
  bug         = { color = "callout-danger",   title = "Bug" },
  example     = { color = "callout-example",  title = "Example" },
  quote       = { color = "callout-quote",    title = "Quote" },
  cite        = { color = "callout-quote",    title = "Cite" },
  screen      = { color = "callout-screen",   title = "Screen Instructions" },
  default     = { color = "callout-default",  title = "" }
}

-- Inject LaTeX preamble for tcolorbox when targeting LaTeX/PDF
function Meta(meta)
  if FORMAT:match 'latex' then
    meta['header-includes'] = meta['header-includes'] or pandoc.List()
    local preamble = [[
\usepackage{tcolorbox}
\usepackage{xcolor}
\tcbuselibrary{breakable,skins}

% Define harmonious modern color palette for callout types
\definecolor{callout-note}{HTML}{0284c7}      % Blue
\definecolor{callout-info}{HTML}{0ea5e9}      % Light Blue
\definecolor{callout-tip}{HTML}{0d9488}       % Teal
\definecolor{callout-success}{HTML}{16a34a}   % Green
\definecolor{callout-warning}{HTML}{ea580c}   % Orange
\definecolor{callout-caution}{HTML}{d97706}   % Amber
\definecolor{callout-danger}{HTML}{dc2626}    % Red
\definecolor{callout-question}{HTML}{7c3aed}  % Purple
\definecolor{callout-example}{HTML}{6d28d9}   % Violet
\definecolor{callout-quote}{HTML}{64748b}     % Slate
\definecolor{callout-screen}{HTML}{2563eb}    % Royal Blue
\definecolor{callout-default}{HTML}{475569}   % Slate Dark

% Define the universal breakable callout box
\newtcolorbox{pandocCalloutBox}[2][]{%
  enhanced,
  breakable,
  boxrule=0.6pt,
  leftrule=3.5pt,
  arc=2.5pt,
  colback=#2!4!white,
  colframe=#2,
  top=7pt, bottom=7pt, left=9pt, right=9pt,
  before skip=9pt, after skip=9pt,
  #1
}
]]
    table.insert(meta['header-includes'], pandoc.RawBlock('latex', preamble))
    return meta
  elseif FORMAT:match 'html' then
    meta['header-includes'] = meta['header-includes'] or pandoc.List()
    local css = [[
<style>
.callout {
  border-left: 4px solid #64748b;
  background-color: #f8fafc;
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  border-radius: 4px;
}
.callout-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1e293b;
}
.callout-note { border-color: #0284c7; background-color: #f0f9ff; }
.callout-info { border-color: #0ea5e9; background-color: #f0f9ff; }
.callout-tip { border-color: #0d9488; background-color: #f0fdfa; }
.callout-warning { border-color: #ea580c; background-color: #fff7ed; }
.callout-danger { border-color: #dc2626; background-color: #fef2f2; }
.callout-question { border-color: #7c3aed; background-color: #faf5ff; }
</style>
]]
    table.insert(meta['header-includes'], pandoc.RawBlock('html', css))
    return meta
  end
end

-- Process BlockQuotes to extract Obsidian Callout syntax and format accordingly
function BlockQuote(el)
  local first = el.content[1]
  local ctype = nil
  local custom_title = nil
  local body = pandoc.List()

  -- Check if the first block is a paragraph starting with [!TYPE]
  if first and first.t == "Para" and #first.content > 0 then
    local first_in = first.content[1]
    if first_in.t == "Str" and first_in.text:match("^%[!([%a_-]+)%]") then
      local raw_type = first_in.text:match("^%[!([%a_-]+)%]")
      ctype = raw_type:lower()

      local title_inlines = pandoc.List()
      local rest_inlines = pandoc.List()
      local past_break = false

      for i = 2, #first.content do
        local inline = first.content[i]
        if not past_break then
          if inline.t == "SoftBreak" or inline.t == "LineBreak" then
            past_break = true
          else
            title_inlines:insert(inline)
          end
        else
          rest_inlines:insert(inline)
        end
      end

      -- If there was body text on the same paragraph after a break, keep it
      if #rest_inlines > 0 then
        body:insert(pandoc.Para(rest_inlines))
      end

      -- Append all remaining blocks in the blockquote
      for i = 2, #el.content do
        body:insert(el.content[i])
      end

      local title_str = stringify(title_inlines):gsub("^%s+", ""):gsub("%s+$", "")
      if title_str ~= "" then
        custom_title = title_str
      end
    end
  end

  local type_info = callout_map[ctype] or callout_map["default"]
  local color = type_info.color
  local title = custom_title or (ctype and type_info.title or "")

  -- If it was a standard BlockQuote without [!TYPE], retain all contents
  if not ctype then
    body = el.content
  end

  -- Target: LaTeX / PDF
  if FORMAT:match 'latex' then
    local result = pandoc.List()
    result:insert(pandoc.RawBlock('latex', string.format('\\begin{pandocCalloutBox}{%s}', color)))

    if title and title ~= "" then
      -- Escape LaTeX special characters in the title
      local escaped_title = title:gsub("([%%#&_])", "\\%1")
      result:insert(pandoc.RawBlock('latex', string.format('{\\noindent\\textbf{\\textsf{%s}}}\\par\\vspace{4pt}', escaped_title)))
    end

    for _, block in ipairs(body) do
      result:insert(block)
    end

    result:insert(pandoc.RawBlock('latex', '\\end{pandocCalloutBox}'))
    return result

  -- Target: HTML
  elseif FORMAT:match 'html' then
    local div_classes = {"callout"}
    if ctype then
      table.insert(div_classes, "callout-" .. ctype)
    else
      table.insert(div_classes, "callout-default")
    end

    local div_content = pandoc.List()
    if title and title ~= "" then
      div_content:insert(pandoc.Div({pandoc.Plain({pandoc.Str(title)})}, {class = "callout-title"}))
    end
    for _, block in ipairs(body) do
      div_content:insert(block)
    end

    local div = pandoc.Div(div_content, {class = table.concat(div_classes, " ")})
    if ctype then
      div.attributes["data-callout"] = ctype
    end
    return div

  -- Other formats (e.g. Markdown export): convert to native Pandoc Div
  else
    if ctype then
      local div = pandoc.Div(body, {class = "callout"})
      div.attributes["data-callout"] = ctype
      if title and title ~= "" then
        div.attributes["title"] = title
      end
      return div
    else
      return el
    end
  end
end
