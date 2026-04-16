import TransactionSystem from '@/components/TransactionSystem';

export default function AdminTransactions() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
      <TransactionSystem />
    </div>
  );
}
