export interface Solution {
  slug: string;
  title: string;
  subtitle: string;
  level: "beginner" | "intermediate" | "advanced";
  hours: number;
  description: string;
  components: string[];
  relatedKitSlugs?: string[];
}

export const solutions: Solution[] = [
  {
    slug: "automated-temperature-control",
    title: "Automated Temperature Control",
    subtitle: "by UjuziLab · 2h · Intermediate",
    level: "intermediate",
    hours: 2,
    description:
      "Build a closed-loop temperature system using sensors and actuators. Ideal follow-up to Arduino Starter Kit lessons.",
    components: ["DHT22 sensor", "Relay module", "Fan or heater relay", "Arduino Uno"],
    relatedKitSlugs: ["arduino-starter-kit"],
  },
  {
    slug: "fire-smoke-detection",
    title: "Fire Smoke Detection",
    subtitle: "by UjuziLab · 1h · Beginner",
    level: "beginner",
    hours: 1,
    description: "Early warning system with buzzer alerts and optional SMS gateway integration.",
    components: ["MQ-2 smoke sensor", "Buzzer", "LED indicators"],
    relatedKitSlugs: ["arduino-starter-kit", "iot-solution-box"],
  },
  {
    slug: "automatic-irrigation",
    title: "Automatic Irrigation",
    subtitle: "by UjuziLab · 2h · Beginner",
    level: "beginner",
    hours: 2,
    description: "Soil moisture–based watering for school gardens and small farms.",
    components: ["Soil moisture sensor", "Water pump", "Relay module"],
    relatedKitSlugs: ["iot-solution-box"],
  },
  {
    slug: "water-level-controller",
    title: "Automatic Water Level Controller",
    subtitle: "by UjuziLab · 2h · Beginner",
    level: "beginner",
    hours: 2,
    description: "Maintain tank levels with float sensors and pump control logic.",
    components: ["Float switch", "Ultrasonic sensor", "Pump relay"],
  },
  {
    slug: "cattle-rustling-alert",
    title: "Cattle Rustling Alert",
    subtitle: "Community challenge · Advanced",
    level: "advanced",
    hours: 4,
    description: "GPS + motion detection prototype for livestock monitoring in rural areas.",
    components: ["GPS module", "Accelerometer", "LoRa or GSM module"],
    relatedKitSlugs: ["iot-solution-box"],
  },
  {
    slug: "tomato-freshness-detector",
    title: "Tomato Freshness Detector",
    subtitle: "by UjuziLab · 3h · Intermediate",
    level: "intermediate",
    hours: 3,
    description: "Color and gas sensors to classify produce quality for market sellers.",
    components: ["Color sensor", "Gas sensor", "OLED display"],
  },
  {
    slug: "irrigation-data-gathering",
    title: "Data Gathering for Irrigation",
    subtitle: "by UjuziLab · 3h · Advanced",
    level: "advanced",
    hours: 3,
    description: "Log soil, humidity, and rainfall data to the cloud for analytics dashboards.",
    components: ["Multiple sensors", "ESP32", "SD card or WiFi module"],
    relatedKitSlugs: ["iot-solution-box"],
  },
  {
    slug: "weather-station",
    title: "Weather Station",
    subtitle: "by UjuziLab · 4h · Intermediate",
    level: "intermediate",
    hours: 4,
    description: "Local weather monitoring with temperature, humidity, and rain gauge.",
    components: ["DHT22", "Rain sensor", "Anemometer (optional)", "LCD display"],
    relatedKitSlugs: ["iot-solution-box"],
  },
];

export function getSolutionBySlug(slug: string) {
  return solutions.find((s) => s.slug === slug);
}
