import { useNavigate } from "react-router-dom";

const CampaignCard = ({ campaign }: any) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
      
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end p-4">
          <h2 className="text-white text-xl font-bold leading-tight">
            {campaign.title}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-gray-600 text-sm line-clamp-3">
          {campaign.description}
        </p>

        {/* Info */}
        <div className="flex justify-between text-sm text-gray-500 mt-4">
          <span>📍 {campaign.location}</span>
          <span>🎯 {campaign.targetVolunteers} volunteers</span>
        </div>

        {/* Button */}
        <button
          onClick={() =>
            navigate(`/events?campaignId=${campaign.id}`)
          }
          className="mt-5 w-full border border-green-600 text-green-600 py-2 rounded-full hover:bg-green-600 hover:text-white transition"
        >
          VIEW EVENTS
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;