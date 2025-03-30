
export interface User {
    username: string;
    email: string;
    role: "volunteer" | "organizer";
    registeredEvents: Event[];
    createdEvents: Event[];
  }
  
  export  interface Event {
    _id: string; 
    title: string;
    date: string;
    status: string;
  }
  
  //Notification type
  export  interface Notification {
    id: string;
    message: string;   
    read: boolean;
    createdAt: string;
  }