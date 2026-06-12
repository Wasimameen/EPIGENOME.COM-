# Ready Veo 2 prompt — EPIGENOME.COM flight film

Use generateVideoFromText with:

  prompt: "Cinematic side view of a vintage silver propeller aircraft
  flying steadily through a dark futuristic sky at dusk, deep navy and
  teal atmosphere, soft volumetric clouds drifting past, gentle banking
  motion, propeller blur, faint golden rim light on the fuselage, film
  grain, anamorphic look, slow tracking shot, loopable"
  aspectRatio: "16:9"
  durationSeconds: 8

Then replace epigenome-theme/assets/video/flight.mp4 with the result
(and regenerate the poster: ffmpeg -i flight.mp4 -frames:v 1 flight-poster.jpg).
