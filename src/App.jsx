import { useState, useMemo, useEffect } from 'react'
import { getPaymentList } from './service/payment.service';
import './App.css'

export const debounce = (func, delay = 600, immediate = false) => {
  let timeout
  return function () {
    const context = this
    const args = arguments
    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, delay)
    if (callNow) func.apply(context, args)
  }
}

function App() {
  const [initialLoad, setInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentList, setPaymentList] = useState([])
  const [paginationMeta, setPaginationMeta] = useState(null)
  const [customerId, setCustomerId] = useState(1)
  const [paymentTypeName, setPaymentTypeName] = useState('')
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  function handleCustomerId(event) {
    setCustomerId(event.target.value)
    fetchPaymentList(event.target.value, page, perPage)
  }

  function handlePage(event) {
    setPage(event.target.value)

    fetchPaymentList(customerId, event.target.value, perPage)
  }

  function handlePerPage(event) {
    setPerPage(event.target.value)

    fetchPaymentList(customerId, page, event.target.value)
  }

  function handlePaymentTypeName(event) {
    setPaymentTypeName(event.target.value)
    console.log(event.target.value)

    fetchPaymentList(customerId, page, perPage, event.target.value)
  }

  async function fetchPaymentList(customerId, page, pageSize, paymentTypeName = null) {
    setPaymentList([]);
    setPaginationMeta(null);
    setIsLoading(true)
    const data = await getPaymentList(customerId, page, pageSize, paymentTypeName)
    setPaymentList(data.pagination_data)
    setPaginationMeta(data.pagination_meta)
    setIsLoading(false)
  }

  function RenderPaymentList() {
    if (isLoading) {
      return (
        <tr>
          <td colSpan='4' align='center' className='className="px-5 py-5 border-b border-gray-200 bg-white text-sm"'>Loading..</td>
        </tr>
      )
    } else if (paymentList.length <= 0) {
      return (
        <tr>
          <td colSpan={4} align='center' className='className="px-5 py-5 border-b border-gray-200 bg-white text-sm"'>Payment List Not Found</td>
        </tr>
      )
    } else {
      return (
        paymentList.map(payment => (
          <tr key={payment.payment_id}>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {payment.payment_id}
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {payment.amount}
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {payment.payment_type.payment_type_id}
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {payment.payment_type.type_name}
            </td>
          </tr>
        ))
      )
    }
  }

  function RenderPaginationDescription() {
    if (paginationMeta) {
      return (
        <div className='flex justify-center mt-5'>
          <div className='flex flex-col text-center'>
            <div>
              <span>Total record {paginationMeta.total_record}</span>
            </div>
            <div>
              <span>Displaying record for page {page} from {paginationMeta.total_page}</span>
            </div>
          </div>
        </div>
      )
    }
  }

  useMemo(async () => {
    if (initialLoad) {
      fetchPaymentList(customerId, page, perPage)
      setInitialLoad(false)
    }
  });

  return (
    <>
      <main className="flex min-h-screen flex-col justify-between p-24">
        <div className="container">
          <div id="title" className="p-5 pl-0">
            <h1 className="font-bold text-2xl leading-tight">Payment</h1>
          </div>

          <div id="filter" className="flex flex-col space-y-3 w-[600px]">
            <div className="flex items-center space-x-2">
              <label className='w-1/4'>Page</label>
              <div className='w-full'>
                <input type="number" value={page} onChange={handlePage} className="w-[250px] shadow-sm border-gray-300 rounded-lg p-2 m-0 focus:ring-indigo-200 focus:border-indigo-400" placeholder="Page" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <label className='w-1/4'>Per Page</label>
              <div className='w-full'>
                <input type="number" value={perPage} onChange={handlePerPage} className="w-[250px] shadow-sm border-gray-300 rounded-lg p-2 m-0 focus:ring-indigo-200 focus:border-indigo-400" placeholder="Per Page" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <label className='w-1/4'>Customer ID</label>
              <div className='w-full'>
                <input type="number" value={customerId} onChange={handleCustomerId} className="shadow-sm border-gray-300 rounded-lg p-2 m-0 focus:ring-indigo-200 focus:border-indigo-400" placeholder="Customer ID" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <label className='w-1/4'>Payment Type</label>
              <div className='w-full'>
                <input type="text" value={paymentTypeName} onChange={handlePaymentTypeName} className="w-[250px] shadow-sm border-gray-300 rounded-lg p-2 m-0 focus:ring-indigo-200 focus:border-indigo-400" placeholder="Search Payment Type Name" />
              </div>
            </div>
          </div>

          <div id="content">
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              <div
                className="inline-block min-w-full shadow-md rounded-lg overflow-hidden"
              >
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                      >
                        Customer Id
                      </th>
                      <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                      >
                        Payment Type Id
                      </th>
                      <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                      >
                        Payment Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <RenderPaymentList />
                  </tbody>
                </table>
              </div>

              <RenderPaginationDescription />
            </div>
          </div>
        </div>
      </main >
    </>
  )
}

export default App
