import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const incdata = [
  { name: 'Jan', value: 50 },
  { name: 'Feb', value: 40 },
  { name: 'Mar', value: 45 },
  { name: 'Apr', value: 70 },
  { name: 'May', value: 43 },
  { name: 'Jun', value: 60 },
  { name: 'Jul', value: 90 },
];

const decdata = [
  { name: 'Jan', value: 90 },
  { name: 'Feb', value: 60 },
  { name: 'Mar', value: 43 },
  { name: 'Apr', value: 70 },
  { name: 'May', value: 45 },
  { name: 'Jun', value: 50 },
  { name: 'Jul', value: 30 },
];

const ProjectStatsCards = ({ isIncrease, title, description, value }) => {
  return (
    <div className='w-1/4 border rounded-md bg-white shadow-sm px-4 py-4 flex justify-between'>
      <div className="left flex flex-col gap-y-1">
        <h3 className='text-sm text-[#8b8b8b]'>{title}</h3>
        <h1 className='font-semibold text-2xl text-primary-txt'>{description}</h1>
        <div className={`flex items-center text-xs gap-x-2 mt-2 ${isIncrease ? 'text-success' : 'text-danger'}`}>
          <span className={`flex items-center text-xs ${isIncrease ? 'text-success bg-success-op border-success' : 'text-danger bg-danger-op border-danger'} border rounded-full p-1`}>
            {isIncrease ? <FaArrowUpLong /> : <FaArrowDownLong />}
            <p className='font-medium'>{value}%</p>
          </span>
          <p className='font-medium text-[#8b8b8b]'> Vs Last Month</p>
        </div>
      </div>

      <div className="right w-24 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={isIncrease ? incdata : decdata}>
            <XAxis hide dataKey="name" />
            <YAxis hide />
            <Tooltip contentStyle={{ display: "none" }} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={isIncrease ? "#00d222" : "#ff4d4d"} 
              strokeWidth={1.5} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ProjectStatsCards;
