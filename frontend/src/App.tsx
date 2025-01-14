import './App.css';
import React from "react";
import { jwtDecode } from "jwt-decode";
const Kyc = React.lazy(() => import('./Pages/Kyc'));
const Layout = React.lazy(() => import('./Layout/index'));
const Spot = React.lazy(() => import('./Pages/Spot'));
const Taxes = React.lazy(() => import('./Pages/Taxes'));
const Cards = React.lazy(() => import('./Pages/Cards'));
const AddTax = React.lazy(() => import('./Pages/AddTax'));
const Crypto = React.lazy(() => import("./Pages/Crypto"));
const SignIn = React.lazy(() => import("./Pages/SignIn"));
const SignUp = React.lazy(() => import('./Pages/SignUp'));
const History = React.lazy(() => import("./Pages/History"));
const EditTax = React.lazy(() => import('./Pages/EditTax'));
const CardList = React.lazy(() => import("./Pages/CardList"));
const Payments = React.lazy(() => import('./Pages/Payments'));
const SendPage = React.lazy(() => import('./Pages/SendPage'));
const Accounts = React.lazy(() => import('./Pages/Accounts'));
const Invoices = React.lazy(() => import('./Pages/Invoices'));
const Settings = React.lazy(() => import('./Pages/Settings'));
const TeamMembers = React.lazy(() => import('./Pages/Members'));
const Dashboard = React.lazy(() => import('./Pages/Dashboard'));
const TestDashboard = React.lazy(() => import('./Pages/TestDashboard'));
const AddMember = React.lazy(() => import('./Pages/AddMember'));
const AddQrCode = React.lazy(() => import('./Pages/AddQrCode'));
const EditQrCode = React.lazy(() => import('./Pages/EditQrCode'));
const AddInvoice = React.lazy(() => import('./Pages/AddInvoice'));
const EditMember = React.lazy(() => import("./Pages/EditMember"));
const HelpCenter = React.lazy(() => import("./Pages/HelpCenter"));
const Error404 = React.lazy(() => import("./Component/Error404"));
const Statements = React.lazy(() => import('./Pages/Statements'));
const AddAccount = React.lazy(() => import('./Pages/AddAccount'));
const UserLayout = React.lazy(() => import('./Layout/UserLayout'));
const EditInvoice = React.lazy(() => import('./Pages/EditInvoice'));
const EditAccount = React.lazy(() => import('./Pages/EditAccount'));
const UserProfile = React.lazy(() => import('./Pages/UserProfile'));
const ReferReward = React.lazy(() => import("./Pages/ReferReward"));
import 'react-toastify/dist/ReactToastify.css';
const MemberSignIn = React.lazy(() => import('./Pages/MemberSignIn'));
import { ToastContainer } from 'react-toastify';
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
const MemberDetails = React.lazy(() => import('./Pages/MemberDetails'));
const ResetPassword = React.lazy(() => import('./Pages/ResetPassword'));
const PaymentQrCode = React.lazy(() => import('./Pages/PaymentQrCode'));
const CompanyDetails = React.lazy(() => import("./Pages/CompanyDetails"));
const NewCompanyEdit = React.lazy(() => import("./Pages/NewCompanyEdit"));
const NewCompanyList =  React.lazy(() => import("./Pages/NewCompanyList"));
import CssBaseline from '@mui/material/CssBaseline';
const ForgotPassword =  React.lazy(() => import("./Pages/ForgotPassword"));
const EditReceipient =  React.lazy(() => import('./Pages/EditReceipient'));
const TransactionList =  React.lazy(() => import('./Pages/TransactionList'));
const TemplateSettings =  React.lazy(() => import('./Pages/TemplateSettings'));
import { ThemeProvider, createTheme } from '@mui/material/styles';
const AdminLogin =  React.lazy(() => import('./Pages/Admin/Login'));
const AdminDashboard =  React.lazy(() => import('./Pages/Admin/Dashboard'));
const AdminSpot =  React.lazy(() => import("./Pages/Admin/Spot"));
const BankTransfer =  React.lazy(() => import('./Pages/Admin/BankTransfer'));

// import News from './Pages/News';
const AdminLayout =  React.lazy(() => import('./Layout/AdminLayout'));
const WalletRequest =  React.lazy(() => import('./Component/Spot/WalletRequest'));
const FeeStructure =  React.lazy(() => import('./Pages/Admin/FeeStructure'));
const Referrals =  React.lazy(() => import('./Pages/Admin/Referrals'));
const Profile =  React.lazy(() => import('./Pages/Admin/Profile'));
const AdminKyc =  React.lazy(() => import('./Pages/Admin/AdminKyc'));
const AdminKycDetails =  React.lazy(() => import('./Pages/Admin/AdminKycDetails'));
const Users =  React.lazy(() => import('./Pages/Admin/Users'));
const Tickets =  React.lazy(() => import('./Pages/Admin/Tickets'));
const Transactions =  React.lazy(() => import('./Pages/Admin/Transactions'));
const AdminUsers =  React.lazy(() => import('./Pages/Admin/AdminUsers'));

// Admin Invoices Pages 
const AdminTaxes = React.lazy(() => import('./Pages/Admin/Invoices/Taxes'));
const AdminAddTax = React.lazy(() => import('./Pages/Admin/Invoices/AddTax'));
const AdminEditTax = React.lazy(() => import('./Pages/Admin/Invoices/EditTax'));
const AdminInvoices = React.lazy(() => import('./Pages/Admin/Invoices/Invoices'));
const AdminSettings = React.lazy(() => import('./Pages/Admin/Invoices/Settings'));
const AdminTemplateSettings = React.lazy(() => import('./Pages/Admin/Invoices/TemplateSettings'));
const AdminAddQrCode = React.lazy(() => import('./Pages/Admin/Invoices/AddQrCode'));
const AdminEditQrCode = React.lazy(() => import('./Pages/Admin/Invoices/EditQrCode'));
const AdminAddInvoice = React.lazy(() => import('./Pages/Admin/Invoices/AddInvoice'));
const AdminEditInvoice = React.lazy(() => import('./Pages/Admin/Invoices/EditInvoice'));
const AdminPaymentQrCode = React.lazy(() => import('./Pages/Admin/Invoices/PaymentQrCode'));

const AdminPayment = React.lazy(() => import('./Pages/Payment/AdminPayment'));
const InvoicePayment = React.lazy(() => import('./Pages/InvoicePayment'));
const Response = React.lazy(() => import('./Pages/Response'));
const Ecommerce = React.lazy(() => import('./Pages/Ecommerce/Ecommerce'));
const List = React.lazy(() => import('./Pages/Ecommerce/List'));
const EcommercePayment = React.lazy(() => import('./Pages/EcommercePayment'));
const WalletAddressList = React.lazy(() => import('./Pages/WalletAddressList'));

const AdminEcommerce = React.lazy(() => import('./Pages/Admin/Ecommerce/Ecommerce'));
const AdminEcommerceList = React.lazy(() => import('./Pages/Admin/Ecommerce/List'));
const FeeType = React.lazy(() => import('./Pages/Admin/FeeType'));
const UserDetails = React.lazy(() => import('./Pages/Admin/UserDetails'));

import { ReactNode } from 'react';

const TransactionAll = React.lazy(() => import('./Pages/TransactionAll'));
const InvoiceEcommercePayment = React.lazy(() => import('./Pages/InvoiceEcommercePayment'));
const ResponseInvoice = React.lazy(() => import('./Pages/ResponseInvoice'));
const ResponseStripe = React.lazy(() => import('./Pages/ResponseStripe'));
const RevenueList = React.lazy(() => import('./Pages/Admin/RevenueList'));
const AdminNotifications = React.lazy(() => import('./Pages/Admin/AdminNotifications'));
const NotificationList = React.lazy(() => import('./Pages/NotificationList'));
const NotificationAll = React.lazy(() => import('./Pages/NotificationAll'));
const CurrencyList = React.lazy(() => import('./Pages/Admin/CurrencyLists'));

const LandingPage = React.lazy(() => import('./Landing/Index'));

const BuySell = React.lazy(() => import('./Pages/CryptoSection/BuySell'));
const Confirm = React.lazy(() => import('./Pages/CryptoSection/Confirm'));
const Complete = React.lazy(() => import('./Pages/CryptoSection/Complete'));

import ResponseCryptoStripe from './Pages/ResponseCryptoStripe';

const QuotesView = React.lazy(() => import('./Pages/Invoice/Quotes/QuotesView'));

const InvoiceTransactions = React.lazy(() => import('./Pages/Invoice/InvoiceTransactions'));

const AddQuotes = React.lazy(() => import('./Pages/Invoice/Quotes/AddQuotes'));
const EditQuotes = React.lazy(() => import('./Pages/Invoice/Quotes/EditQuotes'));
const QuotesList = React.lazy(() => import('./Pages/Invoice/Quotes/QuotesList'));

const PrivacyPolicy = React.lazy(() => import('./Landing/PrivacyPolicy'));
const Clients = React.lazy(() => import('./Pages/Invoice/Clients'));
const ManualPayment = React.lazy(() => import('./Pages/Invoice/ManualPayment'));

const Categories = React.lazy(() => import('./Pages/Invoice/Categories'));
const Products = React.lazy(() => import('./Pages/Invoice/Products'));
const InvioceDashboard  = React.lazy(() => import('./Pages/Invoice/InvioceDashboard'));

const AdminTransactionAll = React.lazy(() => import('./Pages/AdminTransactionAll'));

const AddBeneficiary = React.lazy(() => import('./Pages/AddBeneficiary'));

type Props = {
  children?: ReactNode
}

function PrivateRoute({ children }:Props) {
  return localStorage.getItem("token") ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  return (
  <>
    <CssBaseline />
    <ToastContainer />
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" index element={<LandingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/myapp/web" element={<SignIn />} />
        <Route path="/myapp/admin" element={<AdminLogin />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/member-login" element={<MemberSignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/*" element={<ResetPassword />} />
        <Route path="/payment/:id/*" element={<EcommercePayment />} />
        <Route path="/response/:id" element={<Response />} />
        <Route path="/response-fetch" element={<ResponseStripe />} />
        <Route path="/crypto-response-fetch" element={<ResponseCryptoStripe />} />
        <Route path="/inv-response/:id" element={<ResponseInvoice />} />
        <Route path="/invoice-pay" element={<InvoiceEcommercePayment />} />
        <Route path="/quote/:id/:type" element={<QuotesView/>} />
      </Route>

      <Route path="/" element={<UserLayout />}>
        <Route path="/home" element={<Dashboard />} />
        <Route path="/notificationall" element={<NotificationAll />} />
        <Route path="/notify" element={<NotificationList />} />
        <Route path="/beneficiary/add" element={<AddBeneficiary />} />
        <Route path="/crypto-dashboard" element={<TestDashboard />} />    
        <Route path="/kyc" element={<Kyc/>} />
        <Route path="/crypto/wallet" element={<WalletAddressList/>} />
        <Route path="/ecommerce/payment/:id" element={<Ecommerce/>} />
        <Route path="/ecommerce/list" element={<List/>} />
        <Route path="/spot" element={<Spot />} />
        <Route path="/quotes/add-quote" element={<AddQuotes/>} />
        <Route path="/invoices/quotes/list" element={<QuotesList/>} />
        <Route path="/edit-quote/:id" element={<EditQuotes/>} />
        <Route path="/add-invoice" element={<AddInvoice/>} />
        <Route path="/edit-invoice/:id" element={<EditInvoice/>} />
        <Route path="/invoices/taxes" element={<Taxes/>} />
        <Route path="invoices/Dashboard" element={<InvioceDashboard />} />
        <Route path="invoices/transactions" element={<InvoiceTransactions />} />
        <Route path="/cards" element={<PrivateRoute><Cards /></PrivateRoute>} />
        <Route path="/invoices/add-tax" element={<AddTax/>} />
        <Route path="/invoices/category" element={<Categories/>} />
        <Route path="/invoices/product" element={<Products/>} />
        <Route path="/invoices/clients" element={<Clients/>} />
        <Route path="/invoices/manual-payment" element={<ManualPayment/>} />
        <Route path="/invoices/edit-tax/:id" element={<EditTax/>} />
        <Route path="/invoices/add-qr-code" element={<AddQrCode />} />
        <Route path="/invoices/edit-qrcode/:id" element={<EditQrCode/>} />
        <Route path="/send" element={<SendPage />} />
        <Route path="/crypto" element={<Crypto />} />
        <Route path="/crypto/buysell" element={<BuySell />} />
        <Route path="/crypto/confirm" element={<Confirm />} />
        <Route path="/crypto/complete/:id" element={<Complete />} />
        <Route path="/test-dasbhoard" element={<TestDashboard />} />
        <Route path="/history" element={<History/>} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/invite" element={<ReferReward/>} />
        <Route path="/cards-list" element={<CardList />} />
        <Route path="/members" element={<TeamMembers />} />
        <Route path="/add-member" element={<AddMember />} />
        <Route path="/add-account" element={<AddAccount/>} />
        <Route path="/statements" element={<Statements />} />
        <Route path="/invoice-section" element={<Invoices />} />
        <Route path="/help-center" element={<HelpCenter/>} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/invoices/template-settings" element={<TemplateSettings />} />
        <Route path="/edit-account/:id" element={<EditAccount/>} />
        <Route path="/new-company-list" element={<NewCompanyList/>} />
        <Route path="/edit-receipient/:id" element={<EditReceipient/>} />
        <Route path="/view-details/:id" element={<MemberDetails />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/edit-member/:id" element={<EditMember />} />
        <Route path="/Company-Details" element={<CompanyDetails />} />
        <Route path="/invoices/payment-qr-codes" element={<PaymentQrCode />} />
        <Route path="/edit-company-details/:id" element={<NewCompanyEdit />} />
        <Route path="/transaction-list/:id/:account" element={<TransactionList />} />
        <Route path="/transactions" element={<TransactionAll />} />
        <Route path="/invoice-payment/:id" element={<InvoicePayment />} />
      </Route>

      <Route path="/" element={<AdminLayout />}>
        <Route path="/admin/notificationall" element={<NotificationAll />} />
        <Route path="/admin/currency-list" element={<CurrencyList />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
         <Route path="/admin/notify" element={<NotificationList />} />
        <Route path="/admin/bank-transfer-request" element={<BankTransfer />} />
        <Route path="/admin/admin-users" element={<AdminUsers />} />
        <Route path="/admin/spots" element={<AdminSpot />} />
        <Route path="/admin/wallet-request" element={<WalletRequest />} />
        <Route path="/admin/fee-structure" element={<FeeStructure />} />
        <Route path="/admin/fee-structure-type" element={<FeeType />} />
        <Route path="/admin/referrals" element={<Referrals />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="/admin/kyc" element={<AdminKyc />} />
        <Route path="/admin/kyc-details/:id" element={<AdminKycDetails />} />
        <Route path="/admin/userlist" element={<Users />} />
        <Route path="/admin/user/:id" element={<UserDetails />} />
        <Route path="/admin/tickets" element={<Tickets />} />
        <Route path="/admin/transactions" element={<Transactions />} />

        <Route path="/admin/notifications" element={<AdminNotifications />} />

        <Route path="/admin/total-transactions" element={<AdminTransactionAll />} />
        <Route path="/admin/ecommerce/payment/:id" element={<AdminEcommerce/>} />
        <Route path="/admin/ecommerce/list" element={<AdminEcommerceList/>} />

        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/invoices/add-tax" element={<AdminAddTax/>} />
        <Route path="/admin/invoices/edit-tax/:id" element={<AdminEditTax/>} />
        <Route path="/admin/invoices/add-qr-code" element={<AdminAddQrCode />} />
        <Route path="/admin/invoices/edit-qrcode/:id" element={<AdminEditQrCode/>} />
        <Route path="/admin/add-invoice" element={<AdminAddInvoice/>} />
        <Route path="/admin/edit-invoice/:id" element={<AdminEditInvoice/>} />
        <Route path="/admin/invoice-section" element={<AdminInvoices />} />
        <Route path="/admin/invoices/taxes" element={<AdminTaxes/>} />
        <Route path="/admin/invoices/payment-qr-codes" element={<AdminPaymentQrCode />} />
        <Route path="/admin/invoices/template-settings" element={<AdminTemplateSettings />} />
        <Route path="/admin/payment" element={<AdminPayment />} />

        <Route path="/admin/revenue" element={<RevenueList />} />

      </Route>
      <Route path="*" element={<Error404 />} />
    </Routes>
  </>
  )
}

export default App
