import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Login from "./login";

function getUrgencyColor(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffInMs = expiry - today;
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays <= 7) return "text-red-600";
  if (diffInDays <= 30) return "text-orange-500";
  return "text-green-600";
}

function getDaysUntilExpiry(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffInMs = expiry - today;
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [mode, setMode] = useState("pantry"); // "pantry" or "medicine"
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    expiryDate: "",
    numberOfPackets: "",
    quantity: "",
    unit: ""
  });

  const fetchItems = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/${mode}`,{headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }})
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchItems();
    }
  }, [mode, isLoggedIn]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify(form)
    })
      .then((res) => res.json())
      .then(() => {
        fetchItems();
        setForm({ name: "", expiryDate: "", numberOfPackets: "", quantity: "", unit: "" });
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/${mode}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(() => fetchItems())
      .catch((err) => console.error(err));
  };

  if (!isLoggedIn) {
  return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-3xl font-['Plus_Jakarta_Sans'] font-bold text-center mb-6 outline-black">Pantry & Medicine Tracker</h2>
      <div className="flex justify-center mb-6">
      <Button
        onClick={() => {
          localStorage.removeItem("token");
          setItems([]);
          setIsLoggedIn(false);
        }
      }
      >Logout</Button>
      </div>
      <div className="flex justify-center gap-3 mb-6 font-sans">
        <Button
          onClick={() => setMode("pantry")}
          className={
            mode === "pantry"
              ? "bg-black/50 text-white border border-black"
              : "bg-black/50 text-slate-400 border-0"
          }
        >
          Pantry
        </Button>
        <Button
          onClick={() => setMode("medicine")}
          className={
            mode === "medicine"
              ? "bg-black/50 text-white border-1 border-black"
              : "bg-black/50 text-slate-400 border-0"
          }
        >
          Medicine
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto mb-6 shadow-2xl shadow-pink-950/60">
        <CardContent className="flex flex-wrap gap-3 p-4">
          <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border-white/10" />
          <Input name="expiryDate" placeholder="Expiry Date" type="date" value={form.expiryDate} onChange={handleChange} className="border-white/10" />
          <Input name="numberOfPackets" type="number" placeholder="Number of Packs" value={form.numberOfPackets} onChange={handleChange} className="border-white/10" />
          <Input name="quantity" type="number" placeholder="Quantity per pack" value={form.quantity} onChange={handleChange} className="border-white/10" />
          <Input name="unit" placeholder="Unit (g, ml, tablets)" value={form.unit} onChange={handleChange} className="border-white/10" />
          <Button onClick={handleSubmit}>Add Item</Button>
        </CardContent>
      </Card>

      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        {items.map((item) => (
          <Card key={item._id}>
            <CardContent className="flex justify-between items-center p-4">
              <span className={`font-semibold ${getUrgencyColor(item.expiryDate)}`}>
                {item.name} — {item.numberOfPackets*item.quantity}{item.unit} (expires in {getDaysUntilExpiry(item.expiryDate)} days)
              </span>
              <Button variant="destructive" onClick={() => handleDelete(item._id)}>Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;