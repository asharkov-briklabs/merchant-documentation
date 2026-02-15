import { redirect } from 'react-router';

export function loader() {
  return redirect('/merchant');
}

export default function Index() {
  return null;
}
