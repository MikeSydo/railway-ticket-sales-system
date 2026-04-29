const trains = [
  {
    id: "train-091k",
    number: "091К",
    from: "Київ",
    to: "Львів",
    departureTime: "2026-04-29T22:15:00+03:00",
    arrivalTime: "2026-04-30T06:20:00+03:00",
    duration: "8h 05m",
    wagons: [
      {
        id: "wagon-1",
        type: "Купе",
        seatCount: 24,
        rows: 6,
        seatsPerRow: 4
      },
      {
        id: "wagon-2",
        type: "Плацкарт",
        seatCount: 32,
        rows: 8,
        seatsPerRow: 4
      }
    ]
  },
  {
    id: "train-715k",
    number: "715К",
    from: "Київ",
    to: "Дніпро",
    departureTime: "2026-04-29T07:10:00+03:00",
    arrivalTime: "2026-04-29T13:05:00+03:00",
    duration: "5h 55m",
    wagons: [
      {
        id: "wagon-1",
        type: "Інтерсіті+",
        seatCount: 30,
        rows: 10,
        seatsPerRow: 3
      },
      {
        id: "wagon-2",
        type: "Інтерсіті+",
        seatCount: 30,
        rows: 10,
        seatsPerRow: 3
      }
    ]
  },
  {
    id: "train-012l",
    number: "012Л",
    from: "Одеса",
    to: "Львів",
    departureTime: "2026-04-29T18:45:00+03:00",
    arrivalTime: "2026-04-30T07:30:00+03:00",
    duration: "12h 45m",
    wagons: [
      {
        id: "wagon-1",
        type: "Люкс",
        seatCount: 16,
        rows: 4,
        seatsPerRow: 4
      },
      {
        id: "wagon-2",
        type: "Купе",
        seatCount: 24,
        rows: 6,
        seatsPerRow: 4
      }
    ]
  }
];

module.exports = trains;