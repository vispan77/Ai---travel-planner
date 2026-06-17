import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
    {
        // Link this itinerary to the user who generated it
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        
        tripSummary: mongoose.Schema.Types.Mixed,

        passengers: [
            {
                "Full Name": String,
                "First Name": String,
                "Middle Name": String,
                "Last Name": String,
                "Passenger Type": String,
                "Gender": String,
                "Age": String,
                "Date Of Birth": String,
                "Nationality": String,
                "Passport Number": String,
                "Passport Expiry": String,
                "Frequent Flyer Number": String,
                "Seat Number": String,
                "Meal Preference": String,
            },
        ],

        flights: [
            {
                "Airline Name": String,
                "Airline Code": String,
                "Flight Number": String,
                "Booking Reference": String,
                "PNR": String,
                "Ticket Number": String,
                "Cabin Class": String,
                "Fare Type": String,
                "Departure Airport": String,
                "Departure Airport Code": String,
                "Departure Terminal": String,
                "Departure City": String,
                "Departure Country": String,
                "Departure Date": String,
                "Departure Time": String,
                "Arrival Airport": String,
                "Arrival Airport Code": String,
                "Arrival Terminal": String,
                "Arrival City": String,
                "Arrival Country": String,
                "Arrival Date": String,
                "Arrival Time": String,
                "Duration": String,
                "Layover Information": String,
                "Baggage Allowance": String,
                "Check-In Baggage": String,
                "Cabin Baggage": String,
                "Boarding Time": String,
                "Gate Number": String,
                "Status": String,
            },
        ],

        trains: [
            {
                "Train Name": String,
                "Train Number": String,
                "PNR": String,
                "Coach": String,
                "Seat": String,
                "Berth": String,
                "Boarding Station": String,
                "Destination Station": String,
                "Boarding Date": String,
                "Boarding Time": String,
                "Arrival Date": String,
                "Arrival Time": String,
            },
        ],

        hotels: [
            {
                "Hotel Name": String,
                "Hotel Address": String,
                "City": String,
                "Country": String,
                "Booking ID": String,
                "Room Type": String,
                "Number Of Guests": String,
                "Number Of Rooms": String,
                "Check-In Date": String,
                "Check-Out Date": String,
                "Check-In Time": String,
                "Check-Out Time": String,
                "Contact Number": String,
            },
        ],

        transportation: [mongoose.Schema.Types.Mixed],
        events: [mongoose.Schema.Types.Mixed],

        payments: [mongoose.Schema.Types.Mixed],

        dailyItinerary: [
            {
                Date: String,
                Day: String,
                Itinerary: [
                    {
                        Time: String,
                        Activity: String,
                    },
                ],
                Notes: String,
            },
        ],

        rawExtractedDetails: mongoose.Schema.Types.Mixed,
    },
    { timestamps: true }
);

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

export default Itinerary;