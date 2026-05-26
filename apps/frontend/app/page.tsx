import { redirect } from 'next/navigation';
import type { JSX } from 'react';

export default async function HomePage(): Promise<JSX.Element> {
  redirect('/en/marketplace');
}
