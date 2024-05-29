# Airport Time Estimator

[![Netlify Status](https://api.netlify.com/api/v1/badges/f145b5d3-22b3-40da-b586-80ba24c5afe9/deploy-status)](https://app.netlify.com/sites/airport-time-calc/deploys)

## Overview

The Airport Time Estimator is a simple web application that helps you calculate the optimal time to leave for the airport. By inputting your departure time, driving time to the airport, how early you want to arrive before boarding, and additional time for snacks, the app will compute when you should leave.

## Features

- **Responsive Design**: Mobile-first approach ensures the app looks great on all devices.
- **User-Friendly Interface**: Simple and intuitive form inputs.
- **Real-Time Calculation**: Automatically calculates the best time to leave as you input your details.
- **Add to Calendar**: Provides an option to add the calculated time to your Google Calendar.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/airport-time-estimator.git
   cd airport-time-estimator
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm start
   ```

   The app should now be running on `http://localhost:3000`.

### Building for Production

To create a production build of the app, run:

```sh
npm run build
```

The production-ready files will be in the `build` directory.

## Deployment

This project is configured to deploy on Netlify. The build command and publish directory are specified in the `netlify.toml` file:

```toml
[build]
  command = "npm run build"
  publish = "build"

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## Project Structure

- `public/`: Static assets and the HTML template.
- `src/`: Source code, including components, hooks, and utilities.
- `src/App.js`: Main app component.
- `src/components/`: Contains individual React components.
- `src/hooks/`: Custom hooks for managing form state and URL parameters.
- `src/utils/`: Utility functions for date and time formatting.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Bootstrap](https://getbootstrap.com/)
- [Date-fns](https://date-fns.org/)

## Contact

If you have any questions or feedback, please feel free to reach out.

---

Thank you for using the Airport Time Estimator!
