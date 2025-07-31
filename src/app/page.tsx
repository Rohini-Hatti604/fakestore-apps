import FilterBuilder from  './components/FilterBuilder/FilterBuilder';
import ProductTable from  './components/ProductTable/ProductTable';

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Fake Store Products Details</h1>


      <FilterBuilder />
      <ProductTable />
    </main>
  );
}
