import React, { useContext, useState } from "react";
import { expensesContext } from "../../context/expensesContext";
import { resultByDateRange } from "../../utils/expensesCalculation";
import PrimaryButton from "../buttons/PrimaryButton";
import Form from "./Form";
import Input from "./Input";
import SplitFields from "./SplitFields";
import { format, subDays } from "date-fns";

function FilterByDateForm() {
  const [fromDate, setFromDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [toDate, setToDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const { userExpenses, setExpensesArray, setIncomeArray, setPaidDebtsArray } =
    useContext(expensesContext);

  function handleFilter(e) {
    e.preventDefault();

    const { expenses, income, paidDebts } = userExpenses;
    if (expenses.length > 0) {
      const filteredExpenses = resultByDateRange(expenses, fromDate, toDate);
      setExpensesArray(filteredExpenses);
    }
    if (income.length > 0) {
      const filteredIncome = resultByDateRange(income, fromDate, toDate);
      setIncomeArray(filteredIncome);
    }
    if (paidDebts.length > 0) {
      const filteredDebts = resultByDateRange(paidDebts, fromDate, toDate);
      setPaidDebtsArray(filteredDebts);
    }
  }

  return (
    <Form
      formHeader="Filter results by Date"
      onSubmit={handleFilter}
      formWidth="100%"
    >
      <SplitFields>
        <Input
          type="date"
          label="From Date"
          value={fromDate}
          setValue={setFromDate}
        />
        <Input
          type="date"
          label="To Date"
          value={toDate}
          setValue={setToDate}
        />
        <PrimaryButton
          text="Filter"
          width="150px"
          icon="fas fa-funnel-dollar"
        />
      </SplitFields>
    </Form>
  );
}

export default FilterByDateForm;