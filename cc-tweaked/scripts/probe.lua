-- Read-only capability report for CC:Tweaked computers and turtles.
local function line(key, value)
  print(key .. ": " .. tostring(value))
end

line("Host", _HOST or "unknown")
line("CraftOS", os.version())
line("Computer ID", os.getComputerID())
line("Label", os.getComputerLabel() or "(none)")
local width, height = term.getSize()
line("Terminal", width .. "x" .. height)
line("Colour", term.isColor())

if type(turtle) == "table" then
  line("Turtle fuel", turtle.getFuelLevel())
  line("Selected slot", turtle.getSelectedSlot())
  local used = 0
  for slot = 1, 16 do
    if turtle.getItemCount(slot) > 0 then used = used + 1 end
  end
  line("Occupied slots", used .. "/16")
end

local names = peripheral.getNames()
table.sort(names)
line("Visible peripherals", #names)
for _, name in ipairs(names) do
  local types = { peripheral.getType(name) }
  local methods = peripheral.getMethods(name)
  print("[" .. name .. "] " .. table.concat(types, ", "))
  if methods then
    table.sort(methods)
    print(table.concat(methods, ", "))
  else
    print("Detached while reading")
  end
end

line("Turtle API", type(turtle) == "table")
line("Command API", type(commands) == "table")
line("Multishell API", type(multishell) == "table")
line("HTTP API", type(http) == "table")
