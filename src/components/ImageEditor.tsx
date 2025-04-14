
import  { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import ZoomIn from "../shared/icons/ZoomIn";
import ZoomOut from "../shared/icons/ZoomOut";
import DownloadIcon from "../shared/icons/DownloadIcon";
import DeleteIcon from "../shared/icons/DeleteIcon";
import RotateIcon from "../shared/icons/RotateIcon";
import MaskIcon from "../shared/icons/MaskIcon";
import CropIcon from "../shared/icons/CropIcon";
import CheckTickIcon from "../shared/icons/CheckTickIcon";
import CrossIcon from "../shared/icons/CrossIcon";
import { ICropRect, IPoint } from "./interface";


export interface IProps {
    [key: string]: any;
    images: any;
    imageList:any;
    setImageList:any;
    setImageSave: any;
    imageSave: boolean;
    setImageCancel: any;
    imageCancel: boolean;
    setCurrentIndex: any;
    currentIndex: number;
    selectedFile: File | null;
    setSelectedFile: any;
    setImageRemove: any;
    imageRemove: boolean;
    imageOperationPerform:boolean;
    setImageOperationPerform: any;
    rootClassName?: string;
  }

export const ImageEditor = ({ images ,currentIndex,setCurrentIndex,imageList,setImageList,setImageSave,imageSave,setImageCancel,imageCancel,selectedFile,setSelectedFile,imageRemove,setImageRemove,setImageOperationPerform,imageOperationPerform,rootClassName}:IProps) => {

  const [imageListtemp, setImageListtemp] = useState(images); // Store the original image list
  const [isDrawing, setIsDrawing] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const [doodleActive, setDoodleActive] = useState(false);
  const [cropRect, setCropRect] = useState<ICropRect | null>(null);
  const [rotation, setRotation] = useState(0);
  const [startPoint, setStartPoint] = useState<IPoint | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotateActive, setRotateActive] = useState(false);
  const [imageFormats, setImageFormats] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [zoomInOut, setZoomInOut] = useState("");
  const [activeOperation, setActiveOperation] = useState(false);

  function drawImage(imageList: any) {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
  
    if (!Array.isArray(imageList) || imageList.length === 0) {
      console.error("imageList is not defined or empty.");
      return;
    }
  
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageList[currentIndex];
  
    image.onload = () => {
      const originalWidth = 460;
      const originalHeight = 460;
  
      // Diagonal for canvas size to prevent clipping on rotation
      const diagonal = Math.sqrt(originalWidth ** 2 + originalHeight ** 2);
      const canvasSize = diagonal * zoom;
  
      canvas.width = canvasSize;
      canvas.height = canvasSize;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // --- Draw Image ---
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2); // center
      ctx.scale(zoom, zoom);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-originalWidth / 2, -originalHeight / 2); // shift image origin to top-left
      ctx.drawImage(image, 0, 0, originalWidth, originalHeight);
      ctx.restore();
  
      // --- Draw Crop Overlay (in image space, rotated + zoomed) ---
      if (cropMode && cropRect) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2); // center
        ctx.rotate((rotation * Math.PI) / 180);              // rotate
        ctx.scale(zoom, zoom);                               // zoom AFTER rotation for correct direction
        ctx.translate(-originalWidth / 2, -originalHeight / 2); // origin alignment
        
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1 / zoom; // consistent width across zoom levels
        ctx.strokeRect(
          cropRect.x,
          cropRect.y,
          cropRect.width,
          cropRect.height
        );
        ctx.restore();
      }
  
      canvasToFile();
    };
  }


  function getImageCoordinates(x: number, y: number): { x: number; y: number } {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
  
    const rect = canvas.getBoundingClientRect();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
  
    // Convert mouse position to canvas coordinate system
    let cx = x - rect.left;
    let cy = y - rect.top;
  
    // Translate to center
    cx -= centerX;
    cy -= centerY;
  
    // Undo rotation
    const rad = (-rotation * Math.PI) / 180;
    const rotatedX = cx * Math.cos(rad) - cy * Math.sin(rad);
    const rotatedY = cx * Math.sin(rad) + cy * Math.cos(rad);
  
    // Undo zoom and shift to top-left image coordinates
    const imageX = rotatedX / zoom + 240; // 240 = originalWidth / 2
    const imageY = rotatedY / zoom + 240;
  
    return { x: imageX, y: imageY };
  }
  
  
  
  const handleMouseDown = (e:any) => {
    const rect = canvasRef?.current?.getBoundingClientRect();
    if(!rect)
        return;

    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);

    if (cropMode) {
      const { x: imgX, y: imgY } = getImageCoordinates(e.clientX, e.clientY);
      setStartPoint({ x: imgX, y: imgY });
    } else if (doodleActive) {
      setIsDrawing(true);

      if(!ctxRef.current) 
        return;

      ctxRef.current.beginPath();
      ctxRef.current.moveTo(x, y);
    }
  };

  const handleMouseMove = (e:any) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if(!rect)
        return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    

    if (cropMode && startPoint) {
  const { x: imgX, y: imgY } = getImageCoordinates(e.clientX, e.clientY);
  const width = imgX - startPoint.x;
  const height = imgY - startPoint.y;
  setCropRect({ x: startPoint.x, y: startPoint.y, width, height });
} else if (doodleActive && isDrawing) {
        if(!ctxRef.current)
            return;
      ctxRef.current?.lineTo(x, y);
      ctxRef.current.strokeStyle = "blue";
      ctxRef.current.lineWidth = 2;
      ctxRef.current?.stroke();
    }
  };

  const handleMouseUp = () => {
    if (cropMode) {
      setStartPoint(null);
    
    } else if (doodleActive) {
      setIsDrawing(false);
   
    }
  };
 
  function saveCrop() {
    if (!cropRect) {
      console.log("No crop area selected.");
      return;
    }
  
    const { x, y, width, height } = cropRect;
  
    if (width <= 0 || height <= 0) {
      console.log("Invalid crop dimensions. Please reselect the crop area.");
      return;
    }
  
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageList[currentIndex];
  
    image.onload = () => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 460;
      tempCanvas.height = 460;
  
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) {
        console.log("Could not get temp canvas context.");
        return;
      }
  
      // Draw the original image (unrotated, unzoomed)
      tempCtx.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height);
  
      // Create a new canvas for cropped output
      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = width;
      croppedCanvas.height = height;
  
      const croppedCtx = croppedCanvas.getContext("2d");
      if (!croppedCtx) {
        console.log("Could not get cropped canvas context.");
        return;
      }
  
      // Crop from the original untransformed image
      croppedCtx.drawImage(tempCanvas, x, y, width, height, 0, 0, width, height);
  
      const croppedImage = croppedCanvas.toDataURL("image/jpeg");
  
      const updatedImages = [...imageList];
      updatedImages[currentIndex] = croppedImage;
  
      setImageList(updatedImages);
      setImageOperationPerform(true);
      setCropRect(null);
      setCropMode(false);
      drawImage(updatedImages); // or drawImage(updatedImages[currentIndex]) if you're expecting a single image
    };
  
    image.onerror = () => {
      console.error("Failed to load image for cropping.");
    };
  }
  
  

  function saveDoodle(){
    setCropMode(false);
    const canvas = canvasRef.current;
    const doodledImage = canvas?.toDataURL();
    const updatedImages = [...imageList];
   updatedImages[currentIndex] = doodledImage;

    setImageList(updatedImages);
    setImageOperationPerform(true);
    setDoodleActive(false);
  };
  
  const rotateImage = (angle:any) => {
    setZoom(1);
    setRotation((prev) => prev + angle);
    setRotateActive(true);
  };

  const zoomImage = (factor:any) => {

    if(factor=="1")
    {
        setZoomInOut('zoomin');
    }
    else{
        setZoomInOut('zoomout');
    }
    setCropMode(false);
    setDoodleActive(false);
    setRotateActive(false);
    let scale=1;
     scale += 0.1;
    setZoom(scale);
    canvasRef.current?.style.setProperty("transform", `scale(${scale})`);

    // setZoom((prevZoom) => {
    //   const newZoom = prevZoom + factor;
    //   // Clamp zoom between 1 and 5
    //   return Math.max(1, Math.min(newZoom, 5));
    // });
  };

  function confirmRotation(){
    const canvas = canvasRef.current;
    const rotatedImage = canvas?.toDataURL();
    const updatedImages = [...imageList];
    updatedImages[currentIndex] = rotatedImage;
    setImageOperationPerform(true);
    setImageList(updatedImages);
    setRotation(0);
  };

 const getImageFormatFromResponse = async (url:any) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentType = response.headers.get("Content-Type");
    return contentType ? contentType.split("/")[1] : "unknown";
  } catch (error) {
    console.error(`Error fetching URL: ${url}`, error);
    return "unknown";
  }
};

const checkImageFormats = async () => {
  const formats = [];
  for (const url of images) {
    const format = await getImageFormatFromResponse(url);
    formats.push(format);
  }
  setImageFormats(formats);
};

const canvasToFile  = () => {
  const canvas = canvasRef.current;
  if (!canvas) {
    console.error("Canvas is not available.");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Canvas context is not available.");
    return;
  }

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  let minX = width, minY = height, maxX = 0, maxY = 0;

  // Find non-transparent pixel bounds
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3]; // Alpha channel
      if (alpha > 0) { 
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX === 0 && maxY === 0) {
    console.error("No non-transparent pixels found.");
    return;
  }

  // Define the cropped size
  const croppedWidth = maxX - minX + 1;
  const croppedHeight = maxY - minY + 1;

  // Create a high-resolution canvas for cropping
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    console.error("Cropped canvas context is not available.");
    return;
  }

  // Maintain original resolution
  croppedCanvas.width = croppedWidth;
  croppedCanvas.height = croppedHeight;

  // Draw high-quality cropped image
  croppedCtx.drawImage(canvas, minX, minY, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);

  // Get image format
  const originalFormat = imageFormats[currentIndex] || "png"; // Default format
  const extension = originalFormat === "jpeg" ? "jpg" : originalFormat;
  const mimeType = `image/jpeg`;

  // Quality factor (for JPEG)
  const quality = extension === "jpg" ? 0.99 : 1.0; // Default to 95% quality for JPEG

  // Convert cropped canvas to file with quality preservation
  croppedCanvas.toBlob(
    (blob) => {
      if (blob) {
        const file = new File([blob], `cropped-image.jpeg`, { type: mimeType });
        setSelectedFile(file);
      } else {
        console.error("Canvas toBlob failed");
      }
    },
    mimeType,
    quality
  );
};



const downloadImage = async () => {
    const canvas = canvasRef.current;
    
    if (!canvas) {
      console.error("Canvas is not available.");
      return;
    }
  
    const originalFormat = imageFormats[currentIndex] || "jpeg"; // Default to PNG if format is unknown
    const extension = originalFormat === "jpeg" ? "jpg" : originalFormat;
    const mimeType = `image/${extension}`;
    const imageData = canvas.toDataURL(mimeType);
  
    if (!imageData) {
      console.error("Failed to generate image data URL.");
      return;
    }
  
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `image-${currentIndex + 1}.${extension}`;
    link.click();
  };
  

  const deleteImage = () => {
    if (imageList.length === 0) {
      alert("No images to delete!");
      return;
    }
  
    const updatedImages = [...imageList];
    updatedImages.splice(currentIndex, 1); // Remove the current image
  
    if (updatedImages.length === 0) {
      // If no images are left, clear the canvas
      setImageList([]); 
      setCurrentIndex(0);
      const ctx = ctxRef.current;
      if (ctx) {
        if(!canvasRef.current)
            return;

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear the canvas
      }
    } else {
      // Update the image list and current index
      setImageList(updatedImages);
      setCurrentIndex((prev:any) => Math.min(prev, updatedImages.length - 1));
    }
  };


  function saveChanges () {
    // Save crop if in crop mode
    if (cropMode && cropRect) {
       saveCrop(); // Ensure crop is saved
      setActiveOperation(false);
      
    }
  
    // Save doodle if active
    if (doodleActive) {
      saveDoodle();
     setActiveOperation(false);
    }
    setRotateActive(false);
    // Confirm rotation if rotation is applied
    if (rotation !== 0) {
      confirmRotation();
      setRotateActive(false);
     setActiveOperation(false);

    }
 
    if (zoom !== 1) {
      const canvas = canvasRef.current;
      const zoomedImage = canvas?.toDataURL();
      const updatedImages = [...imageList];
      updatedImages[currentIndex] = zoomedImage;
      setImageList(updatedImages);
    }
  
    // Update the image list with the current canvas image as a fallback
    const canvas = canvasRef.current;
  if (canvas) {
    const updatedImage = canvas.toDataURL();
    const updatedImages = [...imageList];
    updatedImages[currentIndex] = updatedImage;
    setZoomInOut('');
    setImageList(updatedImages);
  
  }
  
    // Reset states after saving
    setCropMode(false);
    setDoodleActive(false);
    setZoom(1);
    setRotation(0);
    setCropRect(null);
    setActiveOperation(false)
  };
  
  const cancelChanges = () => {
    setCropRect(null);
    setImageCancel(false);
    setCropMode(false);
    setDoodleActive(false);
    setRotateActive(false);
    drawImage(imageList);
    setZoom(1);
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (ctx) {
        if(!canvas)
            return;
      ctx.clearRect(0, 0, canvas?.width, canvas?.height);
    }
    if(rotation>0)
    {
      setRotation(0)}
  };

  

  const cancelChangesAll = () => {
    setCropRect(null);
    setCropMode(false);
    setDoodleActive(false);
    setRotateActive(false);
    setImageCancel(false);
    setImageOperationPerform(false);
    setZoomInOut('');
    drawImage(imageListtemp);
    setZoom(1);
    const canvas = imageList[currentIndex];
    const ctx = ctxRef.current;
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if(rotation>0)
    {
      setRotation(0)}
      setImageCancel(false);
  };

  useEffect(() => {
    setImageList(images);
  // Check image formats when the component mounts
  const initializeFormats = async () => {
    await checkImageFormats();
  };
  initializeFormats();
}, []);

useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Prevents "canvas is possibly null" error

    const ctx = canvas.getContext("2d");
    if (!ctx) return; //  Prevents "ctx is possibly null"
    ctxRef.current = ctx;
    drawImage(imageList);

  }, [imageList]);

  useEffect(()=>{
    setActiveOperation(doodleActive||rotation !== 0);
    if(doodleActive)
    {
      setCropMode(false);
    }
    if(doodleActive||rotation !== 0||cropMode){
      setZoomInOut("");
    }
  },[cropMode,doodleActive,rotation,zoom,activeOperation])

  useEffect(() => {
    if (imageList.length > 0) {
      drawImage(imageList); // Redraw the current image
 
    } else {
      const ctx = ctxRef.current;
      if (ctx) {
        if(!canvasRef.current) return;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear canvas if no images
      }
    }
  }, [imageList, currentIndex, cropRect, rotation, zoom, currentIndex]);

  useEffect(()=>{
    setZoom(1);
  },[cropMode,doodleActive,rotateActive])

  useEffect(()=>{
    if(imageCancel)
        cancelChangesAll();
  },[ imageCancel])

  useEffect(()=>{
    if(imageSave)
        saveChanges();
  },[imageSave])
  

  return (
    <ViewerContainer  className={rootClassName}>
      <MainViewer>
        <Button
          hidden={imageList.length <= 1}
          onClick={() => setCurrentIndex((prev: number) => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
        >
          {"<"}
        </Button>
        <CanvasContainer>
          <canvas
            id="canvas"
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
           style={{width: "100%", height: "100%"}}
          />
        </CanvasContainer>
        <Button
          hidden={imageList.length <= 1}
          onClick={() =>
            setCurrentIndex((prev: number) =>
              Math.min(prev + 1, imageList.length - 1)
            )
          }
          disabled={currentIndex === imageList.length - 1}
        >
          {">"}
        </Button>
      </MainViewer>
      <MarginContainer>
        <IconButton onClick={saveChanges} hidden={!activeOperation}>
            <CheckTickIcon  height={20} width={20} />
        </IconButton>
        <IconButton onClick={cancelChanges} hidden={!activeOperation}>
        <CrossIcon  height={20} width={20} />
        
        </IconButton>
        <IconButton onClick={saveCrop} hidden={!cropMode}>
        <CheckTickIcon  height={20} width={20} color={'#fff'}/>
        </IconButton>
        <IconButton onClick={cancelChanges} hidden={!cropMode}>
        <CrossIcon  height={20} width={20} color={'#fff'}/>
        </IconButton>
      </MarginContainer>
      <Controls>
      <IconButton
          disabled={zoom >= 5}
          onClick={cropMode || doodleActive ? undefined : () => zoomImage(1)}
          style={{
            backgroundColor: zoomInOut=='zoomin' ? '#fff' : 'transparent', 
            borderRadius: '4px', 
            padding: '4px',
          }}
        ><ZoomIn height={"20"} width={"20"} color={zoomInOut=='zoomin'?"#000":"#fff"}/><br/>
         <IconLabel>Zoom In</IconLabel> 
        </IconButton>
        <IconButton
          disabled={zoom <= 1}
          onClick={cropMode || doodleActive ? undefined : () => zoomImage(-1)} 
          style={{
            backgroundColor: zoomInOut == 'zoomout' ? '#fff' : 'transparent', 
            borderRadius: '4px', 
            padding: '4px',
          }}>
            <ZoomOut height={20} width={20} color={zoomInOut == 'zoomout' ? "#000":"#fff"}/><br/><IconLabel>Zoom Out </IconLabel>
        </IconButton>
        <IconButton
          active={cropMode}
          onClick={
            cropMode || doodleActive || rotateActive
              ? undefined
              : () => setCropMode((prev: boolean) => !prev)
          }
          style={{
            backgroundColor: cropMode ? '#fff' : 'transparent',
            borderRadius: '4px', 
            padding: '4px',
          }}
        >
            <CropIcon height={"20"} width={"20"} color={cropMode ? '#000':'#fff'}/><br/>
         <IconLabel>Crop</IconLabel> 
        </IconButton>
        <IconButton
          active={doodleActive}
          onClick={
            cropMode ||rotateActive
              ? undefined
              : () => setDoodleActive((prev: boolean) => !prev)
          }
          style={{
            backgroundColor: doodleActive ? '#fff' : 'transparent',
            borderRadius: '4px', 
            padding: '4px',
          }}
        >
            <MaskIcon height={"18"} width={"18"} color={doodleActive?"#000":"#fff"}/><br/>
         <IconLabel>Mask</IconLabel> 
        </IconButton>
        <IconButton onClick={cropMode || doodleActive ? undefined : () => rotateImage(90)}
            style={{
                backgroundColor: rotation>0 ? '#fff' : 'transparent',
                borderRadius: '4px', 
                padding: '4px',
              }}>
            <RotateIcon height={"20"} width={"20"} color={rotation>0?"#000":"#fff"}/><br/>
         <IconLabel>Rotate</IconLabel> 
        </IconButton>
        <DivSeperator/>
        <IconButton onClick={downloadImage}><DownloadIcon height={21} width={21} color={"#fff"}/><br/> <IconLabel>Download</IconLabel></IconButton>
        <IconButton  onClick={() => setImageRemove(true)}><DeleteIcon height={20} width={20} color={'#fff'}/> <br/><IconLabel>Delete</IconLabel> </IconButton>
      </Controls>
      <ThumbnailContainer hidden={imageList.length <=1}>
        {imageList.map((image: string, index: number) => (
          <Thumbnail
            key={index}
            src={image}
            alt={`Thumbnail ${index}`}
            isSelected={index === currentIndex}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </ThumbnailContainer>
    </ViewerContainer>
  );
};

// Styles
const ViewerContainer = styled.div  <any>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #2E2E2E;
  height: 100%;
  width : 100%;
  justify-content: center;
`;

const MainViewer = styled.div  <any>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const CanvasContainer = styled.div  <any>`
  width: 66vh;
  height: 66vh;
  overflow: auto;
  position: relative;
  object-fit: cover;
  border: 1px solid grey;
`;

const ThumbnailContainer = styled.div<{ hidden?: boolean }>`
  display: ${({ hidden }) => (hidden ? "none" : "flex")};
  overflow-x: auto;
  gap: 10px;
  margin-top: 20px;
`;

const Thumbnail = styled.img<{ isSelected: boolean }>`
  width: 50px;
  height: 50px;
  object-fit: cover;
  cursor: pointer;
  border: ${({ isSelected }) => (isSelected ? "1px solid" : "none")};
`;

const Button = styled.button<{ active?: boolean }>`
  background-color: ${({ active }) => (active ? "green" : "gray")};
  border: ${({ active }) => (active ? "1px solid green" : "1px solid gray")};
  padding: 8px 12px;
  cursor: pointer;
  &:disabled {
    background-color: lightgray;
    cursor: not-allowed;
  }
`;

const Controls = styled.div <any>`
  display: flex;
  padding: 12px;
  gap: 10px;
  justify-content: center;
  border-radius: 12px;
  background-color: #212121;
  margin-bottom: 12px;
`;

const IconLabel = styled.span  <any>`
  color: #909090;
  font-size: 12px;
  margin-top: 4px;
`;

const MarginContainer = styled.div  <any>`
  margin: 16px;
`;

const DivSeperator = styled.div  <any>`
  height: 40px;
  border: 1px solid #909090;
`;

const IconButton =  styled.button<{ active?: boolean }>`
  background: transparent;
  border: none;
  color: '#909090';
  font-size: 12px;
  cursor: pointer;
  font-weight: 400;
`;

export 
{Controls,IconButton,IconLabel,Thumbnail,ThumbnailContainer,CanvasContainer,MainViewer,ViewerContainer,Button,MarginContainer};

