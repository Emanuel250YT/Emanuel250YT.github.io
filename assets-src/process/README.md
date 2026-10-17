# Process images

Sources of the four images of the process section (diagnosis, proposal, build, launch).
`npm run assets` turns them into the black & white versions in `src/assets/process/`;
replace these files, never the derived ones.

Generated with Higgsfield, model GPT Image 2.5 (`gpt_image_2_5`), `--aspect_ratio 4:3
--quality high --resolution 2k`, and stored here as JPEG (quality 92). To add or redo
one, keep the shared style so the four read as one series:

> Black and white editorial photograph, rich monochrome tones, soft directional window
> light from the left, calm minimal modern studio desk, light grey matte surfaces, clean
> square and rectangular geometry, gentle shallow depth of field, shot on a 50mm lens,
> premium and understated. Absolutely no text, no letters, no numbers, no logos, no
> brand names anywhere; any screen shows only soft abstract blurred interface shapes.

Scene of each image, followed by the style above:

- `diagnosis.jpg`: A discovery video call in progress: an open laptop on a minimal desk
  shows a video meeting with two softly blurred participants, beside it an open paper
  notebook with a pen and a few hand-drawn check marks and abstract scribbles, a cup of
  black coffee, one hand resting on the notebook. Viewed from a slight 45-degree angle.
- `proposal.jpg`: A written project proposal on a desk, seen from above: a few neatly
  stacked printed pages with abstract grey content blocks, a simple bar timeline drawn
  as rectangles and a small table of empty boxes, a fountain pen lying across them, a
  small square stamp, a pair of reading glasses. Crisp paper texture.
- `build.jpg`: A developer workspace during a weekly build: a large monitor with
  abstract unreadable code-like lines, a compact keyboard and a small notebook, and on
  the wall behind a planning board of square paper notes arranged in four neat columns
  that grow taller from left to right.
- `launch.jpg`: Launch day on a minimal desk: an open laptop shows an abstract dashboard
  with a rising line chart and a large check mark shape, a smartphone beside it lights
  up with an abstract notification card, a small potted plant and a cup of coffee in
  early morning light.
