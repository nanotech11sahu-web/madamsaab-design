import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { Home } from '@/pages/public/Home';
import { Services } from '@/pages/public/Services';
import { Packages } from '@/pages/public/Packages';
import { BookNow } from '@/pages/public/BookNow';
import { Booking } from '@/pages/public/Booking';
import { About } from '@/pages/public/About';
import { Contact } from '@/pages/public/Contact';
import { Login } from '@/pages/public/Login';
import { Register } from '@/pages/public/Register';
import { NotFound } from '@/pages/public/NotFound';

import { CustomerProtectedRoute } from '@/components/customer/CustomerProtectedRoute';
import { CustomerDashboardLayout } from '@/components/customer/CustomerDashboardLayout';
import { Profile } from '@/pages/customer/Profile';
import { Addresses } from '@/pages/customer/Addresses';
import { MyBookings } from '@/pages/customer/MyBookings';
import { MyReviews } from '@/pages/customer/MyReviews';

import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { Dashboard } from '@/pages/admin/Dashboard';
import { AdminServices } from '@/pages/admin/AdminServices';
import { AdminPackages } from '@/pages/admin/AdminPackages';
import { AdminBookings } from '@/pages/admin/AdminBookings';
import { AdminStaff } from '@/pages/admin/AdminStaff';
// Hidden pending separate client sign-off/payment for the CMS add-on — re-enable by uncommenting.
// import { AdminSettings } from '@/pages/admin/AdminSettings';
// import { AdminContact } from '@/pages/admin/AdminContact';
// import { AdminHero } from '@/pages/admin/AdminHero';
// import { AdminTestimonials } from '@/pages/admin/AdminTestimonials';
// import { AdminFaq } from '@/pages/admin/AdminFaq';
// import { AdminTrustFeatures } from '@/pages/admin/AdminTrustFeatures';
import { AdminCoupons } from '@/pages/admin/AdminCoupons';
import { AdminCustomers } from '@/pages/admin/AdminCustomers';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book" element={<BookNow />} />
        <Route path="/booking" element={<Booking />} />

        <Route element={<CustomerProtectedRoute />}>
          <Route element={<CustomerDashboardLayout />}>
            <Route path="/dashboard" element={<Profile />} />
            <Route path="/dashboard/addresses" element={<Addresses />} />
            <Route path="/dashboard/bookings" element={<MyBookings />} />
            <Route path="/dashboard/reviews" element={<MyReviews />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/packages" element={<AdminPackages />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/staff" element={<AdminStaff />} />
          {/* Hidden pending separate client sign-off/payment for the CMS add-on — re-enable by uncommenting. */}
          {/* <Route path="/admin/hero" element={<AdminHero />} /> */}
          {/* <Route path="/admin/testimonials" element={<AdminTestimonials />} /> */}
          {/* <Route path="/admin/faq" element={<AdminFaq />} /> */}
          {/* <Route path="/admin/trust-features" element={<AdminTrustFeatures />} /> */}
          {/* <Route path="/admin/contact" element={<AdminContact />} /> */}
          {/* <Route path="/admin/settings" element={<AdminSettings />} /> */}
        </Route>
      </Route>
      </Routes>
    </>
  );
}

export default App;
