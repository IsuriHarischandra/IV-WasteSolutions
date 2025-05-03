import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './component/Navbar'; // Import your Navbar component
import VehicleAdd from './vehicleComponent/VehicleAdd';
import AllVehicles from './vehicleComponent/AllVehicles';
import ViewVehicle from './vehicleComponent/ViewVehicle';
import UpdateVehicle from './vehicleComponent/UpdateVehicle';
import RequestedVehicles from './vehicleComponent/RequestedVehicles';
import CustomerRegister from './pages/CustomerRegister';
import CustomerLogin from './pages/CustomerLogin';
import HomePage from './pages/Home';
import Cookies from 'js-cookie'; // Import js-cookie library
import Profile from './pages/Profile';
import FeedbackPage from './pages/FeedbackPage';
import EmployeeAddPage from './admin/employeeManagement/EmployeeAddPage';
import MainAdminDashboard from './admin/MainAdminDashboard';
import EmployeeView from './admin/employeeManagement/EmployeeView';
import UpdateEmployee from './admin/employeeManagement/UpdateEmployee';
import CustomerViewPage from './admin/Customer Manager/CustomerViewPage';
import UpdateCustomerPage from './admin/Customer Manager/UpdateCustomerPage';
import ContactUs from './pages/ContactUs';
import ViewContactRequests from './admin/Customer Manager/ViewContactRequests';
import AddPickUp from './pages/pickupComponent/AddPickUp';
import ViewPickUp from './pages/pickupComponent/ViewPickUp';
import EditPickUp from './pages/pickupComponent/EditPickUp';
import AdminPickUp from './admin/residentialAdmin/ViewCPickUp';
import ViewAllFeedbacksPage from './admin/Customer Manager/ViewAllFeedbacksPage';
import AddDailyCollection from './pages/AddDailyCollection';
import ShowDailyCollections from './admin/residentialAdmin/ShowDailyCollections';
import AddTask from './admin/employeeManagement/AddTask';
import ViewTask from './admin/employeeManagement/ViewTask';
import UpdateTask from './admin/employeeManagement/UpdateTask';
import AddSalary from './admin/employeeManagement/AddSalary';
import ShowSalary from './admin/employeeManagement/ShowSalary';
import UpdateSalary from './admin/employeeManagement/UpdateSalary';
import StockView from './pages/StockView';
import ItemDetail from './pages/ItemDetail';
import PaymentPage from './pages/PaymentPage';
import PaymentDetails from './admin/payment Manager/PaymentDetails';
import MnHWaste from './MnH_waste/MnH'
import MnHManager from './MnH_waste/MnH_Manager';

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = Cookies.get('userRole'); 
    console.log('User Role:', role); // Debugging line
    setUserRole(role); // Set the user role state
  }, []);

  return (
    <div className="App flex flex-col">
      <Router>
        {userRole !== 'admin' && <Navbar />} {/* Render Navbar only for customers */}
        
        <div className="flex-1"> {/* Main content area */}
          <Routes>
            <Route path='/customerregister' element={<CustomerRegister />} />
            <Route path='/customerlogin' element={<CustomerLogin />} />
            <Route path='/' element={<HomePage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/feedbackpage/:id' element={<FeedbackPage />} />
            <Route path='/contactus' element={<ContactUs />} />
            <Route path='/addpickup' element={<AddPickUp />} />
            <Route path='/viewpickup' element={<ViewPickUp />} />
            <Route path='/editpickup/:id' element={<EditPickUp />} />
            <Route path='/adddailycollection' element={<AddDailyCollection />} />
            <Route path='/stockview' element={<StockView />} />
            <Route path="/item/:itemId" element={<ItemDetail />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path='/MnHwaste' element={< MnHWaste/>}/>
            
            {userRole === 'admin' && (
              <>
                <Route path='/mainadmindashboard' element={<MainAdminDashboard />} />
                <Route path='/employeeadd' element={<EmployeeAddPage />} />
                <Route path='/addtask' element={<AddTask />} />
                <Route path='/viewtask' element={<ViewTask />} />
                <Route path='/updatetask/:id' element={<UpdateTask />} />
                <Route path='/addsalary' element={<AddSalary />} />
                <Route path='/showsalary' element={<ShowSalary />} />
                <Route path='/updatesalary/:id' element={<UpdateSalary />} />
                <Route path='/employeeview' element={<EmployeeView />} />
                <Route path='/employeeupdate/:id' element={<UpdateEmployee />} />
                <Route path='/customerview' element={<CustomerViewPage />} />
                <Route path='/viewallfeedback' element={<ViewAllFeedbacksPage />} />
                <Route path='/viewcontact' element={<ViewContactRequests />} />
                <Route path='/updatecustomer/:id' element={<UpdateCustomerPage />} />
                <Route path='/vehicleadd' element={<VehicleAdd />} />
                <Route path='/allvehicles' element={<AllVehicles />} />
                <Route path="/vehicles/:id" element={<ViewVehicle />} />
                <Route path="/vehicles/update/:id" element={<UpdateVehicle />} />
                <Route path="/vehicles/requests" element={<RequestedVehicles />} />
                <Route path="/adminpickup" element={<AdminPickUp />} />
                <Route path="/showdailycollection" element={<ShowDailyCollections />} />
                <Route path="/showpayments" element={<PaymentDetails />} />
                <Route path ="/MnHManager" element={<MnHManager/>}/>
                

                
              </>
            )}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
