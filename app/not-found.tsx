import Link from 'next/link';
import { PageTitle } from '../components/site';

export default function NotFound() {
  return <div className="shell page-main"><PageTitle tag="404" title="Page not found" desc="This address may have moved. Browse the tool library or return home."/><Link href="/tools/" className="primary-button">Browse tools</Link> <Link href="/" className="secondary-button">Home</Link></div>;
}
