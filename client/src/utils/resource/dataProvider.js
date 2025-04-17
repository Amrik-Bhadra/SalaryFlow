import {
    MdDashboard,
    MdGroups,
    MdInventory,
    MdSettings,
    MdHelp,
    MdBusinessCenter,
    MdSettings as MdUserSettings,
} from 'react-icons/md';
import { IoDocumentText } from "react-icons/io5";
import { FaUserCheck } from "react-icons/fa6";

const adminSidebarItems = [
    {
        group: "Main",
        items: [
            { name: "Dashboard", icon: MdDashboard, path: "/admin/" },
            { name: "Employees", icon: MdGroups, path: "/admin/employees" },
            { name: "Projects", icon: MdBusinessCenter, path: "/admin/projects" },
            { name: "Attendance", icon: FaUserCheck, path: "/admin/attendance" },
            { name: "Reports", icon: IoDocumentText, path: "/admin/report" },
        ]
    },
    {
        group: "Other",
        items: [
            { name: "Settings", icon: MdSettings, path: "/admin/settings" },
            { name: "Help", icon: MdHelp, path: "/admin/help" },
        ]
    }
];


export {
    adminSidebarItems
}