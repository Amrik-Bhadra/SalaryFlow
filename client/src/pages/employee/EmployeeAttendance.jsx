import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaCamera,
  FaMapMarkerAlt,
  FaSpinner,
  FaTimesCircle,
} from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import useAxios from "../../utils/validator/useAxios";
import BlinkDetector from "./BlinkDetector";

const EmployeeAttendance = () => {
  const [date, setDate] = useState(dayjs());
  const [checkInTime, setCheckInTime] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selfieData, setSelfieData] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const axiosInstance = useAxios();

  // console.log('attendance: ', attendanceData);

  // Get address from coordinates using OpenStreetMap's Nominatim
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "SalaryFlow Employee Attendance System", // Required by Nominatim's usage policy
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch address");
      }

      const data = await response.json();

      if (data && data.display_name) {
        // Format the address in a more readable way
        const address = data.display_name;
        const shortAddress = address.split(",").slice(0, 3).join(","); // Show first 3 parts of address
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

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "#4ade80"; // green
      case "absent":
        return "#f87171"; // red
      case "on-leave":
        return "#facc15"; // yellow
      case "half-day":
        return "#60a5fa"; // blue
      default:
        return "#333333";
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
          maximumAge: 0, // Don't use cached position
        });
      });

      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy, // in meters
      };

      setLocation(locationData);

      // Get address for the location
      await getAddressFromCoordinates(
        locationData.latitude,
        locationData.longitude
      );

      return locationData;
    } catch (error) {
      const errorMessage = error.code
        ? getGeolocationErrorMessage(error.code)
        : "Unable to access location";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Helper function to get user-friendly geolocation error messages
  const getGeolocationErrorMessage = (errorCode) => {
    switch (errorCode) {
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
        address: locationAddress,
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

  const getAttendanceData = async () => {
    const response = await axiosInstance.get(
      `/api/employee/getAttendanceByDate?date=${date.format("YYYY-MM-DD")}`
    );

    if (response.status == 200) {
      setAttendanceData(response.data[0]);
      // console.log('attendanceData: ', response.data[0]);
      console.log("attendance data state: ", attendanceData);
    }
  };

  // Get location on component mount
  useEffect(() => {
    getCurrentLocation();
    getAttendanceData();
  }, [date]);

  // // get attendance detail date wise
  // useEffect(() => {

  //   getAttendanceData();
  // }, [date]);

  return (
    <div className="space-y-6">
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
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isLoading
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

      {/* Add this right below to render BlinkDetector when camera is open */}
      {/* {isCameraOpen && <BlinkDetector />} */}

      {isCameraOpen ? (
        <BlinkDetector
          onFaceMatched={() => {
            setSelfieData('matched');
            setIsCameraOpen(false);
          }}
        />
      ) : (
        selfieData === 'matched' && (
          <div className="text-green-600 font-semibold mt-4">
            Selfie verified, please check in!
          </div>
        )
      )}


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
                <span className="font-medium">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-col p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <span className="text-gray-600">Location</span>
                  </div>
                  <span className="font-medium">
                    {location ? (
                      <span className="text-green-600">
                        ✓ Detected ({location.accuracy.toFixed(0)}m)
                      </span>
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
                <span className={`font-medium ${selfieData ? 'text-green-600' : 'text-red-500'}`}>
                  {selfieData ? "✓ Captured" : "Not Captured"}
                </span>

              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-blue-600" />
                  <span className="text-gray-600">Status</span>
                </div>
                <span
                  className={`font-medium ${checkInTime ? "text-green-600" : "text-yellow-600"
                    }`}
                >
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

        {/* Calendar  Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Attendance Calendar</h2>
            <div className="calendar-container">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                  renderDay={(day, selectedDates, pickersDayProps) => {
                    const dayStr = day.format("YYYY-MM-DD");
                    const isSameDate = attendanceData?.date === dayStr;
                    const statusColor = isSameDate
                      ? getStatusColor(attendanceData.status)
                      : null;

                    return (
                      <PickersDay
                        {...pickersDayProps}
                        sx={{
                          ...(statusColor && {
                            backgroundColor: statusColor,
                            color: "#fff",
                            "&:hover": {
                              backgroundColor: statusColor,
                              opacity: 0.9,
                            },
                          }),
                        }}
                      />
                    );
                  }}
                />
              </LocalizationProvider>
            </div>

            <div className="mt-2 border p-3 rounded-lg">
              <h3 className="text-sky font-semibold">Attendance Details:</h3>
              <div className="flex flex-col gap-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span
                    className="font-medium text-white px-2 py-1 rounded-md"
                    style={{
                      backgroundColor: getStatusColor(attendanceData?.status || "NA"),
                    }}
                  >
                    {attendanceData?.status || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Check In Time</span>
                  <span className="font-medium">
                    {attendanceData?.check_in_time || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Check Out Time</span>
                  <span className="font-medium ">
                    {attendanceData?.check_out_time || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Working Hours</span>
                  <span className="font-medium ">
                    {attendanceData?.totalHours || "0"} hrs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* camera model */}
    </div>
  );
};

export default EmployeeAttendance;