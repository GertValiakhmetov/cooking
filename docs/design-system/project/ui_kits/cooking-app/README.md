# Су-шеф — Cooking App UI Kit

High-fidelity, interactive recreation of the Су-шеф mobile app (the only product surface).
Phone-framed React prototype with mock data. Demonstrates the system end to end.

## Run
Open `index.html`. The frame defaults to light; tap the pill above the phone to toggle dark.

## Screens (interactive)
- **Chat** (`Chat.jsx`) — conversation with streaming assistant, tool-call indicator
  (spinner → checkmark), an inline recipe card, and the pinned chat input bar. Type a
  message + Enter to see the typing indicator and a reply.
- **Pantry** (`Pantry.jsx`) — search, Ingredients / Equipment tabs, expiry badges
  (normal / expires-soon / expired), and tap-to-reveal swipe-to-delete.
- **Recipes** (`Recipes.jsx`) — saved recipe cards with "Всё есть" / "Не хватает N" badges.
- **Cooking mode** (`CookingMode.jsx`) — full-screen step in `--text-cooking` display
  size, progress bar, and a live timer countdown (tap to start/pause). Reached via
  "Готовить" on any recipe card.

## Components
| File | Exports |
|---|---|
| `Icon.jsx` | `Icon` (Lucide wrapper, imperative render), `Badge` |
| `RecipeCard.jsx` | `RecipeCard`, `Stepper`, `IngredientRow` |
| `Chat.jsx` | `ChatScreen`, `ToolCall`, `Typing` |
| `Pantry.jsx` | `PantryScreen`, `PantryRow` |
| `Recipes.jsx` | `RecipesScreen`, `SavedCard` |
| `CookingMode.jsx` | `CookingMode`, `CookTimer` |
| `App.jsx` | `App`, `BottomNav` + mounts to `#root` |
| `data.js` | mock pantry / recipe / chat data (Russian strings) |

## Styling
Tokens come from `../../colors_and_type.css` and component classes from
`../../components.css`. Only frame + screen layout lives in `kit.css`. Every color
is a semantic token, so the theme toggle re-skins the whole app for free.

## Fidelity notes
This is a cosmetic recreation, not production logic — timers, sends, and swipes are
mocked. Components are intentionally small and reusable so they can be reassembled
into new mocks.
