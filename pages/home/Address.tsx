"use client";

import React, { useState } from "react";
import styles from "@/styles/user/Address.module.css";
import { FaUserCircle, FaShoppingCart, FaCreditCard } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineEdit, MdOutlineRadioButtonChecked } from "react-icons/md";
import { GoLocation } from "react-icons/go";
import { useRouter } from "next/router";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import MobileNavbar from "@/components/Layout/MobileNavbar";
import { useCart } from "@/context/CartContext";

interface Address {
  name: string;
  mobile: string;
  area: string;
  landmark: string;
  pincode: string;
  type: string;
}

const AddressPage: React.FC = () => {
  const router = useRouter();
  const { cartItems } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([
    {
      name: "User",
      mobile: "+91 85990000000",
      area: "Sector 63 Noida Noida Up, NOIDA, UTTAR PRADESH, 201301",
      landmark: "",
      pincode: "201301",
      type: "Home",
    },
  ]);

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAddress, setEditAddress] = useState<Address>(addresses[0]);
  const [newAddress, setNewAddress] = useState<Address>({
    name: "",
    mobile: "",
    area: "",
    landmark: "",
    pincode: "",
    type: "Home",
  });

  // Price calculations
  const totalMRP = cartItems.reduce(
    (acc, item) => acc + (item.mrp ?? item.price) * item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price ?? 0) * item.quantity,
    0
  );

  const totalDiscount = totalMRP - totalPrice;

  const handleEditSave = () => {
    const updatedAddresses = [...addresses];
    updatedAddresses[selectedAddressIndex] = { ...editAddress };
    setAddresses(updatedAddresses);
    setShowEditModal(false);
  };

  const handleAddSave = () => {
    setAddresses([...addresses, { ...newAddress }]);
    setShowAddModal(false);
    setNewAddress({
      name: "",
      mobile: "",
      area: "",
      landmark: "",
      pincode: "",
      type: "Home",
    });
  };

  return (
    <>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image
            className={styles.logo}
            src="/logo.png"
            alt="Logo"
            width={155}
            height={45}
            onClick={() => router.push("/home")}
          />
        </div>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.circleFilled}>
              <FaShoppingCart />
            </div>
            <div className={styles.labelActive}>Cart</div>
          </div>
          <div className={styles.line}></div>
          <div className={styles.step}>
            <div className={styles.circleOutlined}>
              <GoLocation />
            </div>
            <div className={styles.label}>Address</div>
          </div>
          <div className={styles.line}></div>
          <div className={styles.step}>
            <div className={styles.circleGrey}>
              <FaCreditCard />
            </div>
            <div className={styles.labelDisabled}>Payment</div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className={styles.wrapper}>
        <div className={styles.left}>
          {/* User Info */}
          <div className={styles.userCard}>
            <FaUserCircle className={styles.avatar} />
            <div className={styles.userInfo}>
              <div className={styles.username}>{addresses[selectedAddressIndex].name}</div>
              <div className={styles.secureLogin}>
                <BsShieldCheck className={styles.shield} />
                You are securely logged in
              </div>
            </div>
            <div className={styles.phone}>📞 {addresses[selectedAddressIndex].mobile}</div>
          </div>

          {/* Email */}
          <h4>Your order updates & invoice will be sent to</h4>
          <div className={styles.emailCard}>
            <HiOutlineMail size={20} />
            <span>demo@gmail.com</span>
            <button className={styles.changeBtn}>Change</button>
          </div>

          {/* Address Box */}
          <div className={styles.addressBox}>
            <div className={styles.addressHeader}>
              <h3>Delivery Address</h3>
              <span
                className={styles.addLink}
                onClick={() => setShowAddModal(true)}
              >
                + Add Address
              </span>
            </div>

            {addresses.map((addr, index) => (
              <div key={index} className={styles.addressCard}>
                <div className={styles.radioRow}>
                  <MdOutlineRadioButtonChecked
                    className={styles.radio}
                    onClick={() => setSelectedAddressIndex(index)}
                  />
                  <div className={styles.addressText}>{addr.area}</div>
                  <MdOutlineEdit
                    className={styles.editIcon}
                    onClick={() => {
                      setSelectedAddressIndex(index);
                      setEditAddress({ ...addr });
                      setShowEditModal(true);
                    }}
                  />
                </div>
                <div className={styles.tagRow}>
                  <strong>{addr.type}</strong>
                </div>
                <button
                  className={styles.deliverBtn}
                  onClick={() => router.push("/checkout/payment")}
                >
                  Deliver Here
                </button>
              </div>
            ))}
          </div>

          {/* Payment Placeholder */}
          <div className={styles.paymentBox}>
            <h3>Payment Method</h3>
            <p>Enter delivery address to access payment options</p>
          </div>
        </div>

        {/* Right Summary */}
        <div className={styles.right}>
          <h3 className={styles.summaryTitle}>
            Order Summary <span>({cartItems.length} items)</span>
          </h3>

          <div className={styles.summaryRow}>
            <span>Total MRP</span>
            <span>₹{totalMRP}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Total Discounts <i>ⓘ</i></span>
            <span className={styles.green}>- ₹{totalDiscount}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Convenience Fee <i>ⓘ</i></span>
            <span>₹0</span>
          </div>

          <hr />

          <div className={styles.summaryTotal}>
            <span>Payable Amount</span>
            <span>₹{totalPrice}</span>
          </div>

          <div className={styles.savingsNote}>
            You will Save ₹{totalDiscount} & Earn ₹10 HK Cash on this order
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3>Add New Address</h3>
              <IoClose
                className={styles.closeBtn}
                onClick={() => setShowAddModal(false)}
              />
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalGrid}>
                <div>
                  <label>Name <span>*</span></label>
                  <input
                    type="text"
                    value={newAddress.name}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Mobile No. <span>*</span></label>
                  <input
                    type="text"
                    value={newAddress.mobile}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, mobile: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label>Address(Area & Street) <span>*</span></label>
                <textarea
                  value={newAddress.area}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, area: e.target.value })
                  }
                />
              </div>
              <div className={styles.modalGrid}>
                <div>
                  <label>Landmark</label>
                  <input
                    type="text"
                    value={newAddress.landmark}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, landmark: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Pincode <span>*</span></label>
                  <input
                    type="text"
                    value={newAddress.pincode}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, pincode: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label>Address Type</label>
                <div className={styles.addressTypeBtns}>
                  <button
                    className={newAddress.type === "Home" ? styles.selected : ""}
                    onClick={() =>
                      setNewAddress({ ...newAddress, type: "Home" })
                    }
                  >
                    Home
                  </button>
                  <button
                    className={newAddress.type === "Office" ? styles.selected : ""}
                    onClick={() =>
                      setNewAddress({ ...newAddress, type: "Office" })
                    }
                  >
                    Office
                  </button>
                  <button
                    className={newAddress.type === "Others" ? styles.selected : ""}
                    onClick={() =>
                      setNewAddress({ ...newAddress, type: "Others" })
                    }
                  >
                    Others
                  </button>
                </div>
              </div>
              <button className={styles.saveDeliver} onClick={handleAddSave}>
                Save Address
              </button>
            </div>
          </div>
          <MobileNavbar />
        </div>
      )}

      {/* Edit Address Modal */}
      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3>Edit Address</h3>
              <IoClose
                className={styles.closeBtn}
                onClick={() => setShowEditModal(false)}
              />
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalGrid}>
                <div>
                  <label>Name <span>*</span></label>
                  <input
                    type="text"
                    value={editAddress.name}
                    onChange={(e) =>
                      setEditAddress({ ...editAddress, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Mobile No. <span>*</span></label>
                  <input
                    type="text"
                    value={editAddress.mobile}
                    onChange={(e) =>
                      setEditAddress({ ...editAddress, mobile: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label>Address(Area & Street) <span>*</span></label>
                <textarea
                  value={editAddress.area}
                  onChange={(e) =>
                    setEditAddress({ ...editAddress, area: e.target.value })
                  }
                />
              </div>
              <div className={styles.modalGrid}>
                <div>
                  <label>Landmark</label>
                  <input
                    type="text"
                    value={editAddress.landmark}
                    onChange={(e) =>
                      setEditAddress({ ...editAddress, landmark: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Pincode <span>*</span></label>
                  <input
                    type="text"
                    value={editAddress.pincode}
                    onChange={(e) =>
                      setEditAddress({ ...editAddress, pincode: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label>Address Type</label>
                <div className={styles.addressTypeBtns}>
                  <button
                    className={editAddress.type === "Home" ? styles.selected : ""}
                    onClick={() =>
                      setEditAddress({ ...editAddress, type: "Home" })
                    }
                  >
                    Home
                  </button>
                  <button
                    className={editAddress.type === "Office" ? styles.selected : ""}
                    onClick={() =>
                      setEditAddress({ ...editAddress, type: "Office" })
                    }
                  >
                    Office
                  </button>
                  <button
                    className={editAddress.type === "Others" ? styles.selected : ""}
                    onClick={() =>
                      setEditAddress({ ...editAddress, type: "Others" })
                    }
                  >
                    Others
                  </button>
                </div>
              </div>
              <button
                className={styles.saveDeliver}
                onClick={handleEditSave}
              >
                Save Changes
              </button>
            </div>
          </div>
          <MobileNavbar />
        </div>
      )}
    </>
  );
};

export default AddressPage;
