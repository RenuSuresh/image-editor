import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { ImageEditor } from "./components/ImageEditor";

function App() {
	const images = [
		"https://store4iisfiles.blob.core.windows.net/fileiisobject/mer/ID_1_39584246_20250507104738.jpg?sv=2020-08-04&se=2025-08-05T10%3A47%3A41Z&sr=b&sp=rw&sig=TJE0olKbbRD5Tt41CmpVjaopBxHnXiJ2iL8V8s4SQVk%3D",
	];
	const [imageList, setImageList] = useState(images);
	const [imageSave, setImageSave] = useState(false);
	const [imageCancel, setImageCancel] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [imageRemove, setImageRemove] = useState(false);
	const [imageOperationPerform, setImageOperationPerform] = useState(false);
	return (
		<div className='App'>
			<ImageEditor
				images={images}
				imageList={imageList}
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
				setImageRemove={setImageRemove}
				imageOperationPerform={false}
				setImageOperationPerform={setImageOperationPerform}
			/>
		</div>
	);
}

export default App;
