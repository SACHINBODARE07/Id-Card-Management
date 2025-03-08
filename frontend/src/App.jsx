import React from "react";
import UserRoutes from "./routes/Routes";  // Keep the user routes
import AdminRoutes from "./routes/AdminRoutes"; // Add the admin routes

const App = () => {
  return (
    <div>
      <UserRoutes />   {/* Load user routes */}
      <AdminRoutes />  {/* Load admin routes */}
    </div>
  );
};

export default App;
