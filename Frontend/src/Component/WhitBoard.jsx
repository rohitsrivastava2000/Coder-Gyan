import React, { useRef, useState, useEffect } from "react";
import {
  Undo,
  Redo,
  Eraser,
  Trash2,
  Pencil,
  SlidersHorizontal,
  Minus,
  Plus,
} from "lucide-react";

const WhiteBoard = ({socketRef,meetingID}) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [isEraser, setIsEraser] = useState(false);

  const historyRef=useRef([]);
  const redoHistoryRef=useRef([]);
  

  useEffect(() => {

    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = lineWidth;
      socketRef.current.emit('color-width',{color,lineWidth,meetingID});
    }
  }, [color, lineWidth]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    socketRef.current.emit('startDrawing',{offsetX,offsetY,meetingID})
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };
  
  useEffect(() => {
  const socket = socketRef.current;

  socket.on('startDrawing', ({ offsetX, offsetY }) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
  });

  socket.on('ondraw', ({ offsetX, offsetY }) => {
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  });

  socket.on('eraser',({newColor,isEraser})=>{
    setColor(newColor);
    setIsEraser(!isEraser);

  })

  socket.on('color-width',({color,lineWidth})=>{
     if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = lineWidth;
    }

    // Reflect in UI if changed
    setColor(color);
    setLineWidth(lineWidth);

//     setColor((prev) => (prev !== color ? color : prev));
// setLineWidth((prev) => (prev !== lineWidth ? lineWidth : prev));

  })
  socket.on('all-clear',()=>{
     ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setHistory([]);
    setRedoHistory([]);
  })

  socket.on('undo', ({ image }) => {
    if (!image) {
      // Clear canvas if no image (initial undo)
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      historyRef.current = [];
    setHistory(historyRef.current);
    redoHistoryRef.current = [];
    setRedoHistory([]);
      return;
    }
      // Do NOT pop again — just set the history state properly
  const updatedHistory = [...historyRef.current];
  updatedHistory.pop(); // ✅ Safe to pop once
  historyRef.current = updatedHistory;
  setHistory(updatedHistory);

  // Push image into redo history
  redoHistoryRef.current.push(image);
  setRedoHistory([...redoHistoryRef.current]);

    const img = new Image();
    img.src = image;
    img.onload = () => {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctxRef.current.drawImage(img, 0, 0);
    };
  });

  socket.on('redo',({image})=>{
    const currentRedo = redoHistoryRef.current;
  if (currentRedo.length === 0) return;

  const redoItem = currentRedo.pop();
  historyRef.current.push(redoItem);

  setRedoHistory([...currentRedo]);
  setHistory([...historyRef.current]);
    const img = new Image();
    img.src = image;
    img.onload = () => {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctxRef.current.drawImage(img, 0, 0);
    };
  })

  socket.on('snapshot', ({ image }) => {
    historyRef.current.push(image);
    setHistory(historyRef.current);
    redoHistoryRef.current=[];
    setRedoHistory(redoHistoryRef.current);
  const img = new Image();
  img.src = image;
  img.onload = () => {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctxRef.current.drawImage(img, 0, 0);
  };
});

  
  return () => {
    socket.off('startDrawing');
    socket.off('ondraw');
    socket.off('eraser');
    socket.off('color-width');
    socket.off('all-clear');
    socket.off('undo');
    socket.off('redo');
    socket.off('snapshot');
    
  };
}, []);

  
  
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    socketRef.current.emit('draw',{offsetX,offsetY,meetingID});
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      ctxRef.current.closePath();
      setIsDrawing(false);

      const canvas = canvasRef.current;
      const snapshot = canvas.toDataURL();
      historyRef.current.push(snapshot);
      setHistory(historyRef.current);
      setRedoHistory([]);
        socketRef.current.emit("snapshot", { image: snapshot, meetingID });
    }
  };

const handleUndo = () => {
  const currentHistory = historyRef.current;
  console.log("historyRef.current.length",historyRef.current.length);
  if (currentHistory.length <= 1) {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    redoHistoryRef.current.push(...currentHistory);
    historyRef.current = [];
    setHistory([]);
    setRedoHistory(redoHistoryRef.current);
    socketRef.current.emit("undo", { image: null, meetingID });
    return;
  }

  const last = currentHistory.pop(); // Remove last
  redoHistoryRef.current.push(last);
  const newImage = currentHistory[currentHistory.length - 1];

  historyRef.current = [...currentHistory];
  setHistory(historyRef.current);
  setRedoHistory(redoHistoryRef.current);

  const img = new Image();
  img.src = newImage;
  img.onload = () => {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctxRef.current.drawImage(img, 0, 0);
  };

  socketRef.current.emit("undo", { image: newImage, meetingID });
};


  const handleRedo = () => {
  const currentRedo = redoHistoryRef.current;
  if (currentRedo.length === 0) return;

  const redoItem = currentRedo.pop();
  historyRef.current.push(redoItem);

  setRedoHistory([...currentRedo]);
  setHistory([...historyRef.current]);

  const img = new Image();
  img.src = redoItem;
  img.onload = () => {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctxRef.current.drawImage(img, 0, 0);
  };

  socketRef.current.emit("redo", { image: redoItem, meetingID });
};


  const handleClear = () => {
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setHistory([]);
    setRedoHistory([]);
    socketRef.current.emit('all-clear',({meetingID}));
  };

  const toggleEraser = () => {
    const newColor = isEraser ? "#000000" : "#ffffff";
    socketRef.current.emit('eraser',{newColor,isEraser,meetingID});
    setColor(newColor);
    setIsEraser(!isEraser);
  };

  return (
    <div className="w-full h-full relative border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-gray-50">
      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md flex items-center gap-2 z-10 border border-gray-100">
        {/* Color Picker */}
        <div className="relative">
          <button className="p-1 hover:bg-gray-100 rounded-full">
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-300 overflow-hidden"
              style={{ backgroundColor: color }}
            >
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
            </div>
          </button>
        </div>

        {/* Line Width */}
        <div className="flex items-center gap-1 px-2">
          <button
            onClick={() => setLineWidth((prev) => Math.max(1, prev - 1))}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
          >
            <Minus size={16} />
          </button>
          <div className="w-8 text-center text-sm text-gray-600">
            {lineWidth}px
          </div>
          <button
            onClick={() => setLineWidth((prev) => prev + 1)}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        {/* Tools */}
        <button
          onClick={toggleEraser}
          title="Eraser"
          className={`p-2 rounded-full hover:bg-gray-100 ${
            isEraser ? "bg-blue-50 text-blue-600" : "text-gray-600"
          }`}
        >
          <Eraser size={18} />
        </button>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        <button
          onClick={handleUndo}
          title="Undo"
          disabled={history.length === 0}
          className={`p-2 rounded-full hover:bg-gray-100 ${
            history.length === 0 ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <Undo size={18} />
        </button>
        <button
          onClick={handleRedo}
          title="Redo"
          disabled={redoHistory.length === 0}
          className={`p-2 rounded-full hover:bg-gray-100 ${
            redoHistory.length === 0 ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <Redo size={18} />
        </button>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        <button
          onClick={handleClear}
          title="Clear Canvas"
          className="p-2 rounded-full hover:bg-red-50 text-red-500 hover:text-red-600"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-white touch-none cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
};

export default WhiteBoard;
