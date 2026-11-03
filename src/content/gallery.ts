// Personal collection: photos kept for a gallery that the current design does not show.
// Nothing imports this file yet. The images are in /public/media/gallery/<group>/, resized to
// 1600 px on the long side, with all metadata (including GPS) stripped.

export type GalleryPhoto = {
  src: string;
  alt: string;
  caption: string;
  group: "sudoku" | "frc";
  /** Date the photo was taken, from the original file. */
  taken: string;
};

const sudoku = (n: string, taken: string, alt: string, caption: string): GalleryPhoto => ({
  src: `/media/gallery/sudoku/img-${n}.webp`,
  alt,
  caption,
  group: "sudoku",
  taken,
});

export const gallery: GalleryPhoto[] = [
  {
    src: "/media/gallery/frc/img-1682.webp",
    alt: "FRC robot on the arena floor beside a blue FIRST Robotics Competition banner reading Winner, 2024 San Diego Regional",
    caption: "FIRST Robotics Competition, 2024 San Diego Regional: the robot beside the winner's banner.",
    group: "frc",
    taken: "2024-03-24",
  },

  // Sudoku solver, Chang Gung University Intelligent Control Lab, Dec 2024.
  sudoku("2180", "2024-12-01", "Early LEGO housing on a desk with a phone underneath as the light source", "An early LEGO housing, with a phone as the light source."),
  sudoku("2181", "2024-12-01", "ESP32-CAM board seated in a LEGO frame, USB cable attached", "The ESP32-CAM seated in its LEGO frame."),
  sudoku("2182", "2024-12-01", "ESP32-CAM web viewer streaming a hand-drawn 3 by 3 grid of digits", "First stream from the camera: a hand-drawn 3×3 grid."),
  sudoku("2183", "2024-12-02", "ESP32-CAM web viewer streaming a hand-drawn zero", "Camera stream of a hand-drawn 0."),
  sudoku("2184", "2024-12-02", "LEGO rig standing over a hand-drawn zero", "The rig over a 0."),
  sudoku("2185", "2024-12-02", "Arduino serial monitor listing the model's probability for each digit", "Serial monitor: the on-device model's probability for each digit."),
  sudoku("2186", "2024-12-02", "LEGO rig standing over a printed 1", "The rig over a 1."),
  sudoku("2187", "2024-12-02", "Lab bench with a laptop, an oscilloscope and the LEGO rig on an iPad", "The bench: laptop, oscilloscope and the rig on an iPad."),
  sudoku("2188", "2024-12-07", "A handwritten 4 on an iPad screen", "A handwritten 4 on the iPad, the backlit input surface."),
  sudoku("2189", "2024-12-07", "LEGO rig over a handwritten 4 on an iPad", "The rig over a 4."),
  sudoku("2190", "2024-12-07", "Serial monitor showing digit 4 predicted at 0.995", "Serial monitor: 4, at 0.995."),
  sudoku("2191", "2024-12-07", "LEGO rig over a handwritten 9 on an iPad", "The rig over a 9."),
  sudoku("2192", "2024-12-07", "Serial monitor showing digit 6 predicted at 0.94", "Serial monitor: 6, at 0.94."),
  sudoku("2196", "2024-12-07", "LEGO rig over a handwritten 8 on an iPad", "The rig over an 8."),
  sudoku("2197", "2024-12-07", "Serial monitor with the prediction split between 6 and 8", "An unsure read: split between 6 and 8."),
  sudoku("2202", "2024-12-14", "Edge Impulse object-detection training results with a 78.1% F1 score and confusion matrix", "Object detection in Edge Impulse: F1 78.1%."),
  sudoku("2204", "2024-12-14", "LEGO rig over a row of two digits, 8 and 3, on an iPad", "Two digits at once, for object detection."),
  sudoku("2205", "2024-12-14", "Serial monitor listing object-detection bounding boxes", "Serial monitor: object-detection bounding boxes."),
  sudoku("2206", "2024-12-14", "LEGO rig over a 3 by 3 grid of digits on an iPad", "The rig over a full 3×3 grid."),
  sudoku("2208", "2024-12-14", "Serial monitor listing detected digits with confidence and position", "Detected digits with confidence and position."),
  sudoku("2209", "2024-12-16", "Bare ESP32-CAM module next to a protoboard", "The ESP32-CAM module on its own."),
  sudoku("2220", "2024-12-26", "Edge Impulse transfer-learning results with 94.4% accuracy and a confusion matrix", "Transfer learning in Edge Impulse: 94.4% accuracy."),
  sudoku("2221", "2024-12-26", "Whiteboard sketch of the rig: light source, Sudoku, ESP32-CAM and a 13 by 13 by 12 stud frame", "The rig planned on a whiteboard, in LEGO studs."),
];
