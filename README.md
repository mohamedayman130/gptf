# FastAPI YOLO Real-Time Detection with Audio Feedback

This project is a real-time object detection web app using FastAPI and YOLO. It streams your camera, detects objects live, and plays an audio file for each detected class.

## Features
- Live camera streaming from your browser
- Real-time object detection using YOLO (Ultralytics)
- Audio feedback: plays a sound for each detected class (e.g., `class_audio/Speed_limit_100km.wav`)
- Modern, responsive web interface

## Requirements
- Python 3.8+
- See `requirements.txt` for Python dependencies

## Installation
1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Place your YOLO model**
   - Put your YOLO model file (e.g., `model_v2.pt`) in the project root.
4. **Add audio files**
   - Place `.wav` or `.mp3` files for each class in the `class_audio/` folder (e.g., `class_audio/Speed_limit_100km.wav`).
5. **Run the app:**
   ```bash
   python main.py
   ```
6. **Open your browser:**
   - Go to [http://localhost:8000](http://localhost:8000)
   - Allow camera access when prompted

## Project Structure
```
├── main.py                # FastAPI backend
├── requirements.txt       # Python dependencies
├── static/                # Frontend (HTML, CSS, JS)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── class_audio/           # Audio files for each class
│   └── CLASSNAME.wav
├── model_v2.pt            # YOLO model file
└── README.md
```

## Notes
- The app will only play audio for detected classes if the corresponding audio file exists in `class_audio/`.
- For best results, use Google Chrome or Microsoft Edge.
- Make sure your camera is connected and accessible.

## License
This project is for educational and demo purposes. 