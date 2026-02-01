import { useNavigate } from "react-router-dom";

function Button({ label, to }) {
  const navigate = useNavigate();
  return (
    <button className="btn" onClick={() => navigate(to)}>
      {label} 
    </button>
  );
}

export default Button;