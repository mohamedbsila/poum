# AirPods 3D Experience - Homepage

A professional, interactive 3D AirPods box animation created with pure JavaScript, CSS, and HTML.

## Features

### 🎯 3D AirPods Box Animation
- **Realistic 3D Model**: Detailed charging case with opening lid mechanism
- **Interactive Rotation**: Drag to rotate the box 360° around Y-axis
- **Smooth Opening/Closing**: Lid opens to reveal AirPods with realistic physics
- **AirPods Animation**: Earbuds rise when case opens and settle back when closing

### 🎮 Interactive Controls
- **Button Controls**: 
  - Rotate Box: Rotate the entire box 180°
  - Open/Close: Toggle the case lid
  - Reset: Return to initial state
- **Mouse/Touch Drag**: Click and drag to rotate the box freely
- **Keyboard Shortcuts**:
  - `R` - Rotate box
  - `O` - Open/close case
  - `Escape` - Reset to initial state

### 🎨 Professional Design
- **Modern UI**: Clean, minimalist design with gradient backgrounds
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: CSS transitions and JavaScript-powered interactions
- **Loading Screen**: Animated loading experience
- **Scroll Effects**: Parallax scrolling and feature animations

### 📱 Product Information
- **AirPods Features**: Detailed descriptions of sound quality, battery life, connectivity
- **Charging Case**: Information about design, wireless charging, durability
- **Professional Copy**: Marketing-quality product descriptions

## Technical Implementation

### 3D Model Structure
```
AirPods Box
├── Charging Case
│   ├── Case Body (6 faces)
│   ├── Case Lid (5 faces)
│   └── Hinge
└── AirPods
    ├── Left Earbud
    └── Right Earbud
```

### Animation States
- **Default**: Box closed, AirPods inside
- **Rotated**: Box rotated 180° around Y-axis
- **Opened**: Lid open, AirPods raised
- **Combined**: Both rotated and opened states

### CSS 3D Transforms
- `transform-style: preserve-3d` for 3D space
- `perspective` for depth perception
- `rotateX/Y/Z` for 3D rotations
- `translateZ` for positioning in 3D space

### JavaScript Classes
- `AirPodsController`: Main animation controller
- `PageAnimations`: Scroll effects and feature animations
- `LoadingAnimation`: Loading screen management

## Usage

1. **Open the homepage**: Navigate to `index.html` in your browser
2. **Interact with the 3D model**:
   - Click buttons for controlled animations
   - Drag the box to rotate freely
   - Use keyboard shortcuts for quick actions
3. **Explore product information**: Scroll to read detailed feature descriptions

## Browser Compatibility

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (limited 3D support)

## Performance

- Optimized CSS transforms for smooth 60fps animations
- Efficient JavaScript event handling
- Responsive design with mobile optimization
- Minimal DOM manipulation for better performance

## Customization

### Colors
Modify CSS variables in `styles.css`:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --background-gradient: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
```

### Animation Speed
Adjust transition durations in CSS:
```css
.airpods-box {
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 3D Model Size
Modify dimensions in CSS:
```css
.case-body {
    width: 120px;
    height: 80px;
}
```

## File Structure

```
public/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and 3D animations
├── script.js           # JavaScript interactions
└── README.md           # This file
```

## Credits

- **Design**: Professional AirPods-inspired design
- **3D Implementation**: Pure CSS transforms and JavaScript
- **Animations**: CSS transitions and JavaScript-powered interactions
- **Typography**: Inter font family for modern look
- **Icons**: Emoji icons for feature highlights

---

Enjoy exploring the 3D AirPods experience! 🎧✨