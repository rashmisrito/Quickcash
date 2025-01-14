const mongoose = require("mongoose");
const { Admin } = require("../models/Admin/admin.model");

async function seedAdmin() {
     // Connect to the database
    await mongoose.connect("mongodb+srv://ganeshs:yHZOEwXPmMsdmNcD@exchangedb.jnm8wmc.mongodb.net/?retryWrites=true&w=majority&appName=Exchangedb", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ superadmin: true });

    if(!existingAdmin) {

       // Create admin credentials
        const adminCredentials = {
          fname: "Admin",
          email: "admin@admin.com",
          password: "password",
          status: true,
          profileAvatar: '',
          resetToken: '',
          superadmin: true
        };

        // password hash is already created in user model that's why here we have not genearted password hash value through bcrypt.

        // Create admin user
        await Admin.create(adminCredentials);
        console.log("Admin user created successfully");
    }  else {
        console.log("Admin user already exists");
    }   
}

// Execute the admin seeder
seedAdmin().then(() => {
  console.log("Admin seeding completed");
  process.exit(0);
}).catch((err) => {
   console.error("Error seeding admin:", err);
   process.exit(1);
});