/**
 * Domain-specific formatter: converts an Employee document
 * (with populated user + department) into the response shape.
 */
export const formatEmployeeResponse = (employee) => {
  if (!employee) return null;
  return {
    id: employee._id || employee.id,
    employeeId: employee.employeeId,
    designation: employee.designation,
    joiningDate: employee.joiningDate,
    phone: employee.phone,
    address: employee.address,
    salary: employee.salary,
    status: employee.status,
    user: employee.user
      ? {
          id: employee.user._id || employee.user.id,
          name: employee.user.name,
          email: employee.user.email,
        }
      : null,
    department: employee.department
      ? {
          id: employee.department._id || employee.department.id,
          name: employee.department.name,
          code: employee.department.code,
        }
      : null,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt,
  };
};
