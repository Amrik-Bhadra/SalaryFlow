import { useState, useRef, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaCheckCircle, FaCamera, FaMapMarkerAlt, FaSpinner, FaTimesCircle } from "react-icons/fa";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

// Camera modal component to ensure proper mounting/unmounting
const CameraModal = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Start camera stream
  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support camera access. Please try using a modern browser like Chrome, Firefox, or Safari.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().then(resolve).catch(error => {
              console.error("Error playing video:", error);
              resolve();
            });
          };
        });

        toast.success("Camera accessed successfully");
      }
    } catch (err) {
      console.error("Camera access error:", err);
      let errorMessage = "Unable to access camera. ";
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage += "Please allow camera access in your browser settings.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMessage += "No camera found. Please make sure your camera is connected.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        errorMessage += "Your camera might be in use by another application.";
      } else if (err.message) {
        errorMessage += err.message;
      }

      toast.error(errorMessage, { duration: 5000 });
      onClose();
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          try {
            track.stop();
          } catch (err) {
            console.error("Error stopping track:", err);
          }
        });
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    } catch (err) {
      console.error("Error stopping camera:", err);
    }
  };

  // Capture selfie
  const handleCapture = () => {
    try {
      if (!videoRef.current) {
        throw new Error("Video element not available");
      }

      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
      const selfieDataUrl = canvas.toDataURL("image/jpeg");
      
      onCapture(selfieDataUrl);
      toast.success("Selfie captured successfully!");
    } catch (error) {
      toast.error("Failed to capture selfie");
      console.error("Capture error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Take Selfie</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleCapture}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                <FaCamera className="text-lg" />
                <span>Capture</span>
              </button>
              <button
                onClick={onClose}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
              >
                <FaTimesCircle className="text-lg" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
          <div className="relative w-full max-w-md mx-auto">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
              style={{ transform: 'scaleX(-1)' }}
            />
            {!streamRef.current && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center p-4">
                  <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-600">Accessing camera...</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Please allow camera access when prompted
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeeAttendance = () => {
  const [date, setDate] = useState(dayjs());
  const [checkInTime, setCheckInTime] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selfieData, setSelfieData] = useState(null);

  // Get address from coordinates using OpenStreetMap's Nominatim
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'SalaryFlow Employee Attendance System' // Required by Nominatim's usage policy
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }

      const data = await response.json();
      
      if (data && data.display_name) {
        // Format the address in a more readable way
        const address = data.display_name;
        const shortAddress = address.split(',').slice(0, 3).join(','); // Show first 3 parts of address
        setLocationAddress(shortAddress);
        return shortAddress;
      } else {
        throw new Error("Unable to get location address");
      }
    } catch (error) {
      console.error("Error getting address:", error);
      setLocationAddress("Address not available");
      return null;
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true, // Request high accuracy
          timeout: 10000, // 10 second timeout
          maximumAge: 0 // Don't use cached position
        });
      });

      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy // in meters
      };
      
      setLocation(locationData);
      
      // Get address for the location
      await getAddressFromCoordinates(locationData.latitude, locationData.longitude);
      
      return locationData;
    } catch (error) {
      const errorMessage = error.code ? getGeolocationErrorMessage(error.code) : "Unable to access location";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Helper function to get user-friendly geolocation error messages
  const getGeolocationErrorMessage = (errorCode) => {
    switch(errorCode) {
      case 1:
        return "Location access denied. Please enable location services.";
      case 2:
        return "Unable to determine location. Please check your GPS settings.";
      case 3:
        return "Location request timed out. Please try again.";
      default:
        return "Unable to access location";
    }
  };

  // Handle camera open
  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  // Handle camera close
  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  // Handle selfie capture
  const handleSelfieCapture = (capturedSelfie) => {
    setSelfieData(capturedSelfie);
    setIsCameraOpen(false);
  };

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      // 1. Get location
      const locationData = await getCurrentLocation();
      
      // 2. Verify required data
      if (!selfieData) {
        throw new Error("Please capture your selfie first");
      }
      
      // 3. Send data to server (mock for now)
      // TODO: Implement API call to save attendance data
      console.log("Attendance Data:", {
        timestamp: new Date(),
        selfie: selfieData,
        location: locationData,
        address: locationAddress
      });

      setCheckInTime(new Date());
      toast.success("Check-in successful!");
    } catch (error) {
      toast.error(error.message || "Failed to check in");
      console.error("Check-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Attendance</h1>
        <div className="flex space-x-4">
          {!selfieData && !isCameraOpen && (
            <button
              onClick={handleOpenCamera}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
            >
              <FaCamera className="text-lg" />
              <span>Open Camera</span>
            </button>
          )}
          <button
            onClick={handleCheckIn}
            disabled={checkInTime || isLoading || !selfieData}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : checkInTime
                ? "bg-green-100 text-green-700"
                : !selfieData
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin text-lg" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaClock className="text-lg" />
                <span>{checkInTime ? "Checked In" : "Check In"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Today's Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Today's Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaClock className="text-blue-600" />
                  <span className="text-gray-600">Check In Time</span>
                </div>
                <span className="font-medium">
                  {checkInTime ? checkInTime.toLocaleTimeString() : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaCalendarAlt className="text-blue-600" />
                  <span className="text-gray-600">Date</span>
                </div>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex flex-col p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <span className="text-gray-600">Location</span>
                  </div>
                  <span className="font-medium">
                    {location ? (
                      <span className="text-green-600">✓ Detected ({location.accuracy.toFixed(0)}m)</span>
                    ) : (
                      "Detecting..."
                    )}
                  </span>
                </div>
                {location && (
                  <div className="text-sm text-gray-500">
                    <div>Lat: {location.latitude.toFixed(6)}</div>
                    <div>Long: {location.longitude.toFixed(6)}</div>
                    <div className="mt-1 text-blue-600 break-words">
                      {locationAddress || "Fetching address..."}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaCamera className="text-blue-600" />
                  <span className="text-gray-600">Selfie</span>
                </div>
                <span className="font-medium">
                  {selfieData ? "✓ Captured" : "Not Captured"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-blue-600" />
                  <span className="text-gray-600">Status</span>
                </div>
                <span className={`font-medium ${checkInTime ? "text-green-600" : "text-yellow-600"}`}>
                  {checkInTime ? "Present" : "Not Checked In"}
                </span>
              </div>
            </div>
          </div>

          {/* Monthly Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Monthly Overview</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Present Days</span>
                <span className="font-medium text-green-600">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Absent Days</span>
                <span className="font-medium text-red-600">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Late Check-ins</span>
                <span className="font-medium text-yellow-600">3</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Attendance Rate</span>
                  <span className="font-medium text-blue-600">90%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar and Camera Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {isCameraOpen ? (
              <CameraModal
                onCapture={handleSelfieCapture}
                onClose={handleCloseCamera}
              />
            ) : selfieData ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Captured Selfie</h2>
                  <button
                    onClick={() => {
                      setSelfieData(null);
                      handleOpenCamera();
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
                  >
                    <FaCamera className="text-lg" />
                    <span>Retake</span>
                  </button>
                </div>
                <div className="relative w-full max-w-md mx-auto">
                  <img
                    src={selfieData}
                    alt="Captured selfie"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-4">Attendance Calendar</h2>
                <div className="calendar-container">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                      value={date}
                      onChange={(newDate) => setDate(newDate)}
                      sx={{
                        width: '100%',
                        '& .MuiPickersDay-root.Mui-selected': {
                          backgroundColor: '#2563eb',
                        },
                        '& .MuiPickersDay-root:hover': {
                          backgroundColor: '#3b82f6',
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <CameraModal
          onCapture={handleSelfieCapture}
          onClose={handleCloseCamera}
        />
      )}
    </div>
  );
};

export default EmployeeAttendance; 