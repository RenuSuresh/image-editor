import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ImageEditor } from './components/ImageEditor';

function App() {
  const images = [
    "https://store4iisfiles.blob.core.windows.net/fileiisobject/mer/CEX_1_39582931_20250409132303.png?sv=2020-08-04&se=2025-07-08T13%3A23%3A05Z&sr=b&sp=rw&sig=xlOWj05EfleOKlaDqKvJyjQgpbTQ46TOhmSueKc1tno%3D",]
  const [imageList, setImageList] = useState(images);
  const [imageSave, setImageSave] = useState(false);
  const [imageCancel, setImageCancel] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageRemove, setImageRemove] = useState(false);
  const [imageOperationPerform, setImageOperationPerform] = useState(false);
  return (
    <div className="App">
        <ImageEditor images={images} imageList={imageList}
      setImageList={setImageList}
      imageSave={imageSave}
      setImageSave={setImageSave}
      imageCancel={imageCancel}
      setImageCancel={setImageCancel}
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      selectedFile={selectedFile}
      setSelectedFile={setSelectedFile}
      imageRemove={imageRemove}
      setImageRemove ={setImageRemove}
      imageOperationPerform={false} 
      setImageOperationPerform={setImageOperationPerform}      /> 
    </div>
  );
}

export default App;
