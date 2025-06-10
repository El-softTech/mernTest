

const DashboardCard = ({ icon, title, description, href }) => {
  return (
    <a
      href={href}
      className="bg-white shadow-md hover:shadow-xl transition duration-300 p-6 rounded-2xl border border-gray-100 flex flex-col items-start gap-3 hover:scale-[1.02]"
    >
      {icon}
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </a>
  );
};

export default DashboardCard;
