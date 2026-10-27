# Figma plugin gotchas

Read before scripting the FRN-2026 file with `use_figma`. Each one cost a session a round-trip.

- **Text max width can't be bound.** `setBoundVariable('maxWidth', …)` throws on a TEXT node, and the Figma UI doesn't offer it either. Wrap the text in an auto-layout frame, bind the frame's `maxWidth`, and set the text to Fill (see the Page header `Layout=Tablet` variant, G46).
- **`boundVariables` entries can be arrays.** Fills, strokes and some fields return `[{id}]`; take `[0]` before `getVariableByIdAsync`.
- **Descriptions re-escape `" < > '`.** They read back as `&quot;` etc. Write curly quotes and no angle brackets (F45).
- **`findAll` doesn't exist on TEXT nodes.** Walk up with `.parent`, or call `findAll` on a frame.
- **The Components board (`2291:769`) clips.** A new component added below its fixed height is invisible and screenshots render 1×1. The board now hugs its content; if a screenshot comes back 1×1, check `clipsContent` and the parent's bounds.
- **Renaming a component into a variant set re-keys its properties.** `combineAsVariants` gives every property a new `#id` suffix; read `componentPropertyDefinitions` again before calling `setProperties`. Instance overrides survive.
- **KC Pelletier Sans can't be loaded by the agent.** Edits that reflow KC text (content, size, width) are the user's. Reassigning a text style works without loading the font.
- **First line of every script:** `await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('2246:754'));`. Never `loadAllPagesAsync`.
- **Code Connect writes are refused on this plan.** `send_code_connect_mappings` and `add_code_connect_map` return "only … in libraries that are in Organization or Enterprise plans". Link by hand in Dev Mode (Code Connect panel, repo already connected) using the index in [`components/README.md`](components/README.md). When a plan or permission could block a bulk write, send one row first (*tracer bullet*), then the rest.
- **Inventory with `get_metadata` on the Components board (`2291:769`).** One call lists every component set and standalone component with node IDs. `get_code_connect_suggestions` returns one entry per instance with an image link (about 100 for the Footer alone), so skip it.
