# Beat Tutor

A free course on making beats in FL Studio with a MIDI keyboard, built as a single web page.

- Setup for the Akai MPK Mini IV (and MPK Mini MK3, Launchkey Mini, MiniLab 3, full-size keyboards, or no keyboard at all)
- Drawn, labelled FL Studio windows: Channel Rack, Piano Roll, Playlist, Mixer, Edison, Slicex, settings dialogs
- Playable controller drawings, beat recipes (rage, pluggnb, plugg, trap, R&B) and a sampling lesson with a chop tool
- SLAYR song breakdowns taught step by step, with facts from public databases and their sources

Everything runs in the browser with no build step for visitors. Progress and settings are saved in your own browser only.

## Editing

The page is built from `src/`:

```
python3 build.py
```

Then open `index.html`, or serve the folder (`python3 -m http.server`).

The FL Studio windows and controllers are drawings made for teaching, not screenshots. FL Studio is a trademark of Image-Line; this project is not affiliated with Image-Line, Akai, Novation or Arturia.
