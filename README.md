# Rongpeng Zhou — personal website

Where to find things:

```
index.html          Homepage (open this in Live Preview)
accounting.html     Relevant Coursework page (linked from "Accounting")
work.html           Older one-page version of the site

css/                How things LOOK (colours, sizes, layout)
  home.css            Homepage + shared header/footer/colours (--underline lives here)
  coursework.css      Extra styles for accounting.html
  work.css            Styles for work.html

js/                 How things BEHAVE (clicks, card text)
  home.js             Homepage: the ITEMS list (card titles, descriptions,
                      photos, Spotify link), name swap, opening/closing cards

images/
  cards/              Photos shown in the detail cards (icons + the 3 words)
  collage/            The 6 photos in the homepage collage
  logos/              Company/club logos used on work.html
  originals/          Full-size backups of photos that were resized/cropped
                      (not used by the site; safe to keep or delete)
```

Quick guide:
- Change words on the page → the `.html` file
- Change a card's title/description/photo → `ITEMS` in `js/home.js`
- Change colours or sizes → `css/home.css`
- Add a photo → drop it in the right `images/` folder, then use a path like
  `images/cards/MyPhoto.jpg`
