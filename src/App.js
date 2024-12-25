import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [filterField, setFilterField] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        // const response = await axios.get("http://localhost:5000/admin/customers", {
        //   params: {
        //     page,
        //     limit,
        //     search,
        //     filterField,
        //     filterValue,
        //   },
        // });

        const response = await axios.get("http://localhost:5000/admin/customers", {
          params: { page, limit, search, filterField, filterValue },
        });
        
        console.log("Query Params:", response);

        setCustomers(response.data.customers);
        setTotal(response.data.total);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
      setLoading(false);
    };

    fetchCustomers();
  }, [page, limit, search, filterField, filterValue]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "filterField") {
      setFilterField(value);
    } else if (name === "filterValue") {
      setFilterValue(value);
    }
    setPage(1);
  };

  const handlePaginationChange = (direction) => {
    if (direction === "next" && page * limit < total) {
      setPage(page + 1);
    } else if (direction === "prev" && page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="app-container">
      <h1>Customer Dashboard</h1>

      {/* Search and Filter */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={handleSearchChange}
          className="filter-input"
        />
        <select
          name="filterField"
          value={filterField}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Select Filter Field</option>
          <option value="name_of_customer">Name</option>
          <option value="email">Email</option>
          <option value="mobile_number">Mobile Number</option>
        </select>
        <input
          type="text"
          name="filterValue"
          value={filterValue}
          onChange={handleFilterChange}
          placeholder="Enter filter value"
          className="filter-input"
        />
      </div>

      {/* Customers Table */}
      <table className="customers-table">
        <thead>
          <tr>
            <th>S No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>DOB</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="loading">Loading...</td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.s_no}>
                <td>{customer.s_no}</td>
                <td>{customer.name_of_customer}</td>
                <td>{customer.email}</td>
                <td>{customer.mobile_number}</td>
                <td>{new Date(customer.dob).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div>
        <button onClick={() => handlePaginationChange("prev")}>Previous</button>
        <span>{`Page ${page} of ${Math.ceil(total / limit)}`}</span>
        <button onClick={() => handlePaginationChange("next")}>Next</button>
      </div>
    </div>
  );
};

export default App;