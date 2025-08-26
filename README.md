# E-Commerce Website

A modern, multilingual e-commerce website built with Symfony 6, featuring cash on delivery payment, admin dashboard, and support for French, Arabic, and English languages.

## Features

- 🌐 **Multilingual Support**: French (default), Arabic, and English
- 🛒 **Shopping Cart**: Full cart functionality with session management
- 💳 **Cash on Delivery**: No online payment - customers pay when they receive products
- 👨‍💼 **Admin Dashboard**: Complete admin panel for managing products, orders, and users
- 🔍 **Search Functionality**: Product search with real-time results
- 📱 **Responsive Design**: Modern, mobile-friendly interface
- 🎨 **Modern UI**: Beautiful design with animations and gradients
- 📊 **Order Management**: Complete order lifecycle management
- 👤 **User Authentication**: Secure login/registration system

## Technology Stack

- **Backend**: Symfony 6.1
- **Database**: MySQL (XAMPP)
- **Frontend**: Bootstrap 5, JavaScript, CSS3
- **ORM**: Doctrine ORM
- **Templating**: Twig
- **Security**: Symfony Security Bundle

## Prerequisites

- PHP 8.1 or higher
- MySQL (XAMPP)
- Composer
- Apache/Nginx web server

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecommerce-website
```

### 2. Install Dependencies
```bash
composer install
```

### 3. Configure Environment
Copy the `.env` file and configure your database settings:
```bash
cp .env .env.local
```

Edit `.env.local` and update the database URL:
```env
DATABASE_URL="mysql://root:@127.0.0.1:3306/ecommerce_db?serverVersion=8.0.32&charset=utf8mb4"
```

### 4. Setup Database
Run the database setup script:
```bash
php setup_database.php
```

This will:
- Create the database
- Create all tables
- Add sample data
- Create admin user

### 5. Configure Web Server

#### Apache Configuration
Create a virtual host or use the built-in PHP server:

```bash
# For development
php -S localhost:8000 -t public/
```

#### XAMPP Configuration
1. Place the project in your `htdocs` folder
2. Access via `http://localhost/ecommerce-website/public/`

### 6. Set Permissions
```bash
chmod -R 755 var/
chmod -R 755 public/
```

## Usage

### Access the Website
- **Frontend**: `http://localhost:8000` (or your configured URL)
- **Admin Panel**: `http://localhost:8000/admin`

### Default Admin Credentials
- **Email**: `admin@ecommerce.tn`
- **Password**: `admin123`

## Project Structure

```
├── config/                 # Configuration files
├── public/                 # Web root directory
│   ├── images/            # Product and category images
│   ├── style.css          # Main stylesheet
│   └── app.js             # Main JavaScript file
├── src/                   # Source code
│   ├── Controller/        # Controllers
│   ├── Entity/           # Database entities
│   └── Repository/       # Data repositories
├── templates/             # Twig templates
│   ├── admin/            # Admin templates
│   ├── home/             # Homepage templates
│   ├── product/          # Product templates
│   └── security/         # Authentication templates
├── translations/          # Translation files
│   ├── messages.fr.yaml  # French translations
│   ├── messages.en.yaml  # English translations
│   └── messages.ar.yaml  # Arabic translations
└── var/                  # Cache and logs
```

## Features in Detail

### 1. Multilingual Support
- Language switcher in navigation
- RTL support for Arabic
- All text content translated
- Locale persistence

### 2. Shopping Cart
- Session-based cart management
- Add/remove products
- Quantity updates
- Cart total calculation
- Persistent cart across sessions

### 3. Product Management
- Product listing with categories
- Product details page
- Stock management
- Product search
- Category filtering

### 4. Order System
- Cash on delivery payment
- Order confirmation
- Order tracking
- Admin order management
- Email notifications (configurable)

### 5. Admin Dashboard
- Product management (CRUD)
- Category management
- Order management
- User management
- Sales statistics
- Order status updates

### 6. User Management
- User registration
- User authentication
- Profile management
- Order history
- Address management

## Customization

### Adding New Languages
1. Create a new translation file in `translations/`
2. Add the language to the language switcher in `templates/base.html.twig`
3. Update the translation configuration

### Styling
- Main styles: `public/style.css`
- Bootstrap 5 for responsive design
- Custom CSS variables for easy theming
- RTL support for Arabic

### Adding New Features
- Controllers in `src/Controller/`
- Entities in `src/Entity/`
- Templates in `templates/`
- Translations in `translations/`

## Security Features

- Password hashing with Symfony's password hasher
- CSRF protection
- SQL injection prevention (Doctrine ORM)
- XSS protection (Twig auto-escaping)
- Session security
- Role-based access control

## Performance Optimization

- Doctrine query optimization
- Asset minification (configurable)
- Cache management
- Database indexing
- Lazy loading for images

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check XAMPP is running
   - Verify database credentials in `.env`
   - Ensure MySQL service is active

2. **Permission Errors**
   - Set proper permissions on `var/` and `public/` directories
   - Check web server user permissions

3. **Translation Issues**
   - Clear cache: `php bin/console cache:clear`
   - Check YAML syntax in translation files

4. **Composer Issues**
   - Update Composer: `composer self-update`
   - Clear Composer cache: `composer clear-cache`

### Debug Mode
Enable debug mode in `.env`:
```env
APP_ENV=dev
APP_DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: contact@ecommerce.tn
- Documentation: Check the code comments and templates
- Issues: Use the GitHub issues page

## Changelog

### Version 1.0.0
- Initial release
- Basic e-commerce functionality
- Multilingual support
- Admin dashboard
- Cash on delivery payment
- Responsive design 
