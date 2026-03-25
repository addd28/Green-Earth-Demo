export interface Campaign {
  id: number;
  title: string;
  description: string;
  location: string;
  start_date: string; // DATE từ DB
  end_date: string;   // DATE từ DB
  target_volunteers: number;
  target_amount: number;
  image: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}