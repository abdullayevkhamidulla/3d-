# AXIOM GT — scroll-driven hero (React + GSAP)

    npm install
    npm run dev      # http://localhost:5173
    npm run build    # production build in dist/

- `public/scrub.mp4`  all-keyframe video so scrubbing forward/backward is smooth
- `public/audio.mp3`  the video's own audio, played in sync with scroll
- `src/components/Hero.jsx`  pinned hero, ScrollTrigger scrub -> video.currentTime
- `src/ambient.js`  Web Audio engine (forward/reversed audio, follows scroll speed)
