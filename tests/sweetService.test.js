const service = require('../src/sweetService.js');

const validCategories = ['Nut-Based', 'Fruit-Based', 'Milk-Based', 'Sugar-Based', 'Others'];

describe('Sweet Service', () => {
  beforeEach(() => service.reset());

  test('should add new sweet to inventory', () => {
    const sweet = { id: 1001, name: 'Test Sweet', category: 'Nut-Based', price: 10, quantity: 5 };
    service.addSweet(sweet);
    const sweets = service.getAllSweets();
    expect(sweets).toContainEqual(sweet);
  });

  test('should not add sweet with duplicate ID', () => {
    const sweet1 = { id: 1002, name: 'Sweet A', category: 'Milk-Based', price: 20, quantity: 3 };
    const sweet2 = { id: 1002, name: 'Sweet B', category: 'Sugar-Based', price: 25, quantity: 2 };
    service.addSweet(sweet1);
    expect(() => {
      service.addSweet(sweet2);
    }).toThrow('Sweet with this ID already exists');
  });

  test('should not add sweet with invalid category', () => {
    const sweet = { id: 1003, name: 'Invalid Category', category: 'Fake', price: 10, quantity: 1 };
    expect(() => {
      service.addSweet(sweet);
    }).toThrow('Invalid category');
  });

  test('should not add sweet with negative price or quantity', () => {
    const sweet1 = { id: 1004, name: 'Neg Price', category: 'Others', price: -5, quantity: 2 };
    const sweet2 = { id: 1005, name: 'Neg Qty', category: 'Nut-Based', price: 10, quantity: -3 };
    expect(() => service.addSweet(sweet1)).toThrow('Price must be non-negative');
    expect(() => service.addSweet(sweet2)).toThrow('Quantity must be non-negative');
  });

  test('should delete sweet by ID', () => {
    const sweet = { id: 1006, name: 'Delete Me', category: 'Fruit-Based', price: 15, quantity: 3 };
    service.addSweet(sweet);
    service.deleteSweet(1006, 'delete123'); 
    service.deleteSweet(1006, 'delete123');
    const sweets = service.getAllSweets();
    expect(sweets.find(s => s.id === 1006)).toBeUndefined();
  });

  test('should do nothing when deleting non-existent sweet', () => {
    expect(() => service.deleteSweet(9999,'delete123')).not.toThrow();
  });

  test('should purchase sweet and reduce quantity', () => {
    const sweet = { id: 1007, name: 'Buy Me', category: 'Milk-Based', price: 20, quantity: 10 };
    service.addSweet(sweet);
    service.purchaseSweet(1007, 4);
    const updated = service.getAllSweets().find(s => s.id === 1007);
    expect(updated.quantity).toBe(6);
  });

  test('should throw error when purchasing more than available', () => {
    const sweet = { id: 1008, name: 'Low Stock', category: 'Sugar-Based', price: 20, quantity: 2 };
    service.addSweet(sweet);
    expect(() => service.purchaseSweet(1008, 5)).toThrow('Not enough stock');
  });

  test('should throw error when purchasing non-existent sweet', () => {
    expect(() => service.purchaseSweet(9999, 1)).toThrow('Sweet not found');
  });

  test('should restock sweet and increase quantity with correct password', () => {
    const sweet = { id: 1009, name: 'Restock Me', category: 'Others', price: 25, quantity: 5 };
    service.addSweet(sweet);
    service.restockSweet(1009, 10, 'secret123');
    const updated = service.getAllSweets().find(s => s.id === 1009);
    expect(updated.quantity).toBe(15);
  });

  test('should throw error when restocking with wrong password', () => {
    const sweet = { id: 1010, name: 'Wrong Pass', category: 'Nut-Based', price: 25, quantity: 5 };
    service.addSweet(sweet);
    expect(() => service.restockSweet(1010, 10, 'badpass')).toThrow('Invalid password');
  });

  test('should throw error when restocking non-existent sweet', () => {
    expect(() => service.restockSweet(9999, 10, 'secret123')).toThrow('Sweet not found');
  });

  // Search tests
  test('should search sweets by partial name (case-insensitive)', () => {
    service.addSweet({ id: 1011, name: 'Mango Barfi', category: 'Fruit-Based', price: 40, quantity: 10 });
    const results = service.searchSweets({ name: 'mango' });
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Mango Barfi');
  });

  test('should search sweets by category', () => {
    service.addSweet({ id: 1012, name: 'Badam Halwa', category: 'Nut-Based', price: 60, quantity: 5 });
    const results = service.searchSweets({ category: 'Nut-Based' });
    expect(results.find(s => s.id === 1012)).toBeDefined();
  });

  test('should search sweets by price range', () => {
    service.addSweet({ id: 1013, name: 'Cheap Sweet', category: 'Others', price: 15, quantity: 10 });
    const results = service.searchSweets({ minPrice: 10, maxPrice: 20 });
    expect(results.find(s => s.id === 1013)).toBeDefined();
  });

  test('should return empty array if no sweets match search', () => {
    service.addSweet({ id: 1014, name: 'Random Sweet', category: 'Sugar-Based', price: 50, quantity: 1 });
    const results = service.searchSweets({ name: 'xyz' });
    expect(results).toEqual([]);
  });

  test('should search by combined filters (name & category & price)', () => {
    service.addSweet({ id: 1015, name: 'Kesar Peda', category: 'Milk-Based', price: 30, quantity: 8 });
    const results = service.searchSweets({ name: 'kesar', category: 'Milk-Based', minPrice: 20, maxPrice: 40 });
    expect(results.length).toBe(1);
    expect(results[0].id).toBe(1015);
  });
  //for empty search
  test('should handle empty search (return all sweets)', () => {
    service.addSweet({ id: 1016, name: 'Sweet 1', category: 'Nut-Based', price: 10, quantity: 2 });
    service.addSweet({ id: 1017, name: 'Sweet 2', category: 'Others', price: 20, quantity: 3 });
    const results = service.searchSweets({});
    expect(results.length).toBe(2);
  });

});
private boolean isActiveBooking(LocalDate targetDate, Long userId) {
        // 1. Fetch the employee (this includes their full history of participations)
        Employee employee = employeeRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found!!"));

        // 2. Extract all BookingRequests the user is part of
        List<BookingRequest> allUserBookings = employee.getBookingParticipants().stream()
                .map(BookingParticipant::getBookingRequest)
                .toList();

        LocalDateTime now = LocalDateTime.now();

        // 3. Filter using Java Streams
        return allUserBookings.stream().anyMatch(booking -> {
            
            // Condition 1: Must be on the specific date they are trying to book
            boolean isSameDate = booking.getSlot().getDate().equals(targetDate);

            // Condition 2: Must be CONFIRMED or PENDING
            boolean isActiveStatus = (booking.getStatus() == BookingRequest.RequestStatus.CONFIRMED || 
                                      booking.getStatus() == BookingRequest.RequestStatus.PENDING);

            // Condition 3: Has NOT played yet (Slot's End Time is in the future)
            LocalDateTime slotEndDateTime = LocalDateTime.of(booking.getSlot().getDate(), booking.getSlot().getEndTime());
            boolean isNotPlayedYet = slotEndDateTime.isAfter(now);

            // If ALL three are true, they have an active booking blocking them today
            return isSameDate && isActiveStatus && isNotPlayedYet;
        });
              }
    public void cancelBooking(Long bookingId, CustomUserPrincipal user) {
        BookingRequest request = bookingRequestRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
                
        LocalDateTime slotStartDateTime = LocalDateTime.of(request.getSlot().getDate(), request.getSlot().getStartTime());

        if (slotStartDateTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("You cannot cancel a past booking!");
        }
        
        // CHANGED: Removed the 'minusMinutes(45)' cancellation restriction. They can cancel anytime.
        
        if (!request.getPrimaryBooker().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can only cancel your own bookings!");
        }
        if (request.getStatus() == BookingRequest.RequestStatus.CANCELLED) {
            throw new IllegalArgumentException("Booking is already cancelled.");
        }

        GameSlot slot = request.getSlot();
        
        if (request.getStatus() == BookingRequest.RequestStatus.CONFIRMED) {
            // 1. Penalize/Decrement counts for the team that cancelled
            decrementPlayCount(request.getPrimaryBooker(), slot.getGame());
            if (request.getParticipants() != null) {
                for (BookingParticipant part : request.getParticipants()) {
                    if (!part.getEmployee().getId().equals(request.getPrimaryBooker().getId())) {
                        decrementPlayCount(part.getEmployee(), slot.getGame());
                    }
                }
            }

            // 2. AUTO-REASSIGNMENT LOGIC
            Long newWinnerId = getWinningBookingRequestId(slot.getId());
            
            if (newWinnerId != null) {
                // Someone was on the waitlist! Give it to them instantly.
                BookingRequest newWinner = bookingRequestRepository.findById(newWinnerId).get();
                newWinner.setStatus(BookingRequest.RequestStatus.CONFIRMED);
                incrementTeamPlayCount(newWinner);
                bookingRequestRepository.save(newWinner);
                
                log.info("AUTO-REASSIGN: Slot {} reassigned from cancelled booking to New Winner {}", slot.getId(), newWinner.getPrimaryBooker().getEmail());
                
                // Send Confirmation Emails to the new winners
                sendBookingRequestMail(newWinner.getPrimaryBooker(), newWinner);
                newWinner.getParticipants().forEach(part -> sendBookingRequestMail(part.getEmployee(), newWinner));
                
                checkAndResetCycle(slot.getGame().getId());
            } else {
                // Nobody is on the waitlist. Open the slot for anyone to grab.
                slot.setStatus(GameSlot.SlotStatus.OPEN);
                gameSlotsRepository.save(slot);
                log.info("Cancelled booking was CONFIRMED. No waitlist found. Re-opening Slot ID {}", slot.getId());
            }
        }

        // 3. Mark the original request as cancelled and notify them
        request.setStatus(BookingRequest.RequestStatus.CANCELLED);
        bookingRequestRepository.save(request);
        sendMailForCancellation(request);
    }
// App.jsx
import "./App.css";
import { ToastContainer } from "react-toastify";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

// ... [Keep all your existing Page imports here] ...
import Login from "./Pages/Auth/Login";
import Home from "./Pages/Home";
import Layout from "./Layout/Layout";
// ... (I've truncated the imports for brevity, keep all of yours!)

// 1. Define the router outside the component
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Note: I changed path="/" to index for the Home route, which is best practice for default child routes */}
      <Route index element={<Home />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      
      {/* Travel Routes */}
      <Route path="/travel" element={<MyTravels />} />
      <Route path="/travel/:travelId/:empId" element={<ShowTravelDetails />} />
      <Route path="/travel/create" element={<CreateTravel />} />
      <Route path="/travel/uploadDocs/:ownerId/:travelId" element={<UploadDocument />} />
      <Route path="/travel/manager/:managerId" element={<TeamTravel />} />
      <Route path="/travelDoc/:travelId/:empId" element={<TravelDocEmployee />} />
      <Route path="/travel-expense/:travelAssignmentId/Create" element={<CreateExpense />} />
      <Route path="/travel-expense/:travelId/:empId" element={<ShowTravelExpense />} />
      <Route path="/notification/:userId" element={<NotificationPage />} />
      <Route path="/orgChart/:empId" element={<OrgChart />} />
      
      {/* Job Openings */}
      <Route path="/jobOpening" element={<Jobs />} />
      <Route path="/jobOpening/Create" element={<CreateJob />} />
      <Route path="/jobOpening/share/:jobId" element={<ShareJob />} />
      <Route path="/jobOpening/referr/:jobId" element={<ReferraJob />} />
      <Route path="/job-referrals/:jobId" element={<JobReferrals />} />
      
      {/* Config */}
      <Route path="/config" element={<Config />} />
      
      {/* Game Booking */}
      <Route path="/game/booking" element={<ShowGameHistory />} />
      <Route path="/game/slot/:gameId" element={<ShowUpcomingSlot />} />
      <Route path="/game/slot/:slotId/:gameId" element={<SlotBooking />} />
      <Route path="/game/config" element={<GameConfig />} />
      <Route path="/game/config/:gameId" element={<UpdateGameConfig />} />
      <Route path="/game/create" element={<CreateGameConfig />} />
      <Route path="/game/slot-monitor/:gameId" element={<SlotMonitoring />} />
      <Route path="/achievements" element={<AchievementsPage />} />
      <Route path="/calender" element={<Calender />} />
    </Route>
  )
);

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
      />
      {/* 2. Provide the router to your app */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
        
// App.jsx
import "./App.css";
import { ToastContainer } from "react-toastify";
import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider 
} from "react-router-dom";

// Import your context here now
import AuthUserContextProvider from './Contexts/AuthUserContext.jsx'; 

// ... [Keep all your Page and Layout imports] ...
import Layout from "./Layout/Layout";
import Home from "./Pages/Home";
import Login from "./Pages/Auth/Login";
// ... 

// 1. Create a Root Wrapper Component
// Everything inside here has access to useNavigate!
const RootWrapper = () => {
  return (
    <AuthUserContextProvider>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
      />
      <Layout />
    </AuthUserContextProvider>
  );
};

// 2. Define the router, passing the RootWrapper to the very top route
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootWrapper />}>
      <Route index element={<Home />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      
      {/* Travel Routes */}
      <Route path="/travel" element={<MyTravels />} />
      {/* ... keeping the rest of your travel routes exactly the same ... */}
      
      {/* Game Booking */}
      <Route path="/game/booking" element={<ShowGameHistory />} />
      {/* ... keeping the rest of your game routes exactly the same ... */}
    </Route>
  )
);

// 3. Just render the Provider in App
function App() {
  return <RouterProvider router={router} />;
}

export default App;
        
