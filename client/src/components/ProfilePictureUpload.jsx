import { useState, useRef, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import { FaUpload, FaTimes, FaCheck, FaCamera, FaImage, FaSpinner } from 'react-icons/fa';
import 'react-image-crop/dist/ReactCrop.css';
import toast from 'react-hot-toast';
import axios from 'axios';

// Constants for image restrictions
const MAX_FILE_SIZE_MB = 5;
const COMPRESSED_IMAGE_SIZE = 800; // Max width/height after compression
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

// Image compression utility
const compressImage = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > COMPRESSED_IMAGE_SIZE) {
            height = Math.round((height * COMPRESSED_IMAGE_SIZE) / width);
            width = COMPRESSED_IMAGE_SIZE;
          }
        } else {
          if (height > COMPRESSED_IMAGE_SIZE) {
            width = Math.round((width * COMPRESSED_IMAGE_SIZE) / height);
            height = COMPRESSED_IMAGE_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob with quality 0.8 for JPEG
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/jpeg',
          0.8
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const ProfilePictureUpload = ({ onImageCropped, onClose }) => {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const imgRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const validateFile = (file) => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      throw new Error('Please upload a valid image file (JPEG, PNG, or WebP)');
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      throw new Error(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
    }
  };

  const onSelectFile = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        const file = e.target.files[0];
        validateFile(file);
        
        // Compress image
        const compressedBlob = await compressImage(file);
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          setImgSrc(reader.result?.toString() || '');
          setIsUsingCamera(false);
        });
        reader.readAsDataURL(compressedBlob);
        
        toast.success('Image loaded and compressed successfully');
      } catch (error) {
        toast.error(error.message);
        e.target.value = '';
      }
    }
  };

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support camera access");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
        setIsUsingCamera(true);
        setImgSrc('');
      }
    } catch (err) {
      toast.error('Unable to access camera: ' + (err.message || 'Unknown error'));
      setIsUsingCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureFromCamera = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

    // Convert to blob and compress
    try {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
      const compressedBlob = await compressImage(blob);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
        setIsUsingCamera(false);
        stopCamera();
      });
      reader.readAsDataURL(compressedBlob);
      
      toast.success('Photo captured successfully');
    } catch (error) {
      toast.error('Failed to capture photo');
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };

  const handleCropComplete = () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = imgRef.current;

    if (!ctx) return;

    // Set canvas size to desired dimensions
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    ctx.drawImage(
      image,
      (completedCrop.x * image.naturalWidth) / 100,
      (completedCrop.y * image.naturalHeight) / 100,
      (completedCrop.width * image.naturalWidth) / 100,
      (completedCrop.height * image.naturalHeight) / 100,
      0,
      0,
      size,
      size
    );

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        try {
          const compressedBlob = await compressImage(blob);
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            setCroppedImage(reader.result);
          });
          reader.readAsDataURL(compressedBlob);
          toast.success('Image cropped successfully');
        } catch (error) {
          toast.error('Failed to process image');
        }
      },
      'image/jpeg',
      0.8
    );
  };

  const handleUpload = async () => {
    if (!croppedImage) {
      toast.error('Please crop the image first');
      return;
    }

    setIsUploading(true);
    try {
      // Convert base64 to blob
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      
      // Create FormData
      const formData = new FormData();
      formData.append('profilePicture', blob, 'profile-picture.jpg');

      // Upload to server
      const uploadResponse = await axios.post('/api/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (uploadResponse.data.success) {
        toast.success('Profile picture uploaded successfully');
        onImageCropped(croppedImage);
        onClose();
      } else {
        throw new Error(uploadResponse.data.message || 'Upload failed');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Upload Profile Picture</h2>
            <div className="flex space-x-2">
              {imgSrc && completedCrop && !croppedImage && (
                <button
                  onClick={handleCropComplete}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  <FaCheck className="text-lg" />
                  <span>Crop</span>
                </button>
              )}
              {croppedImage && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    isUploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {isUploading ? (
                    <>
                      <FaSpinner className="text-lg animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FaUpload className="text-lg" />
                      <span>Upload</span>
                    </>
                  )}
                </button>
              )}
              <button
                onClick={onClose}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
              >
                <FaTimes className="text-lg" />
                <span>Cancel</span>
              </button>
            </div>
          </div>

          {!imgSrc && !isUsingCamera ? (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => startCamera()}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <FaCamera className="text-lg" />
                    <span>Use Camera</span>
                  </button>
                  <label className="cursor-pointer bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2">
                    <FaImage className="text-lg" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onSelectFile}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 text-center mt-4">
                  Maximum file size: {MAX_FILE_SIZE_MB}MB<br />
                  Supported formats: JPEG, PNG, WebP
                </p>
              </div>
            </div>
          ) : isUsingCamera ? (
            <div className="flex flex-col items-center space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-md rounded-lg"
                style={{ transform: 'scaleX(-1)' }}
              />
              <div className="flex space-x-4">
                <button
                  onClick={captureFromCamera}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  <FaCamera className="text-lg" />
                  <span>Capture</span>
                </button>
                <button
                  onClick={() => {
                    stopCamera();
                    setIsUsingCamera(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
                >
                  <FaTimes className="text-lg" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              {croppedImage ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-64 h-64 rounded-full overflow-hidden">
                    <img
                      src={croppedImage}
                      alt="Cropped"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Click the Upload button to save your profile picture
                  </p>
                </div>
              ) : (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    alt="Upload"
                    src={imgSrc}
                    onLoad={onImageLoad}
                    className="max-h-[60vh] object-contain"
                  />
                </ReactCrop>
              )}
              {!croppedImage && (
                <p className="text-sm text-gray-500">
                  Drag to move and resize the crop area. Click the Crop button when ready.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUpload; 