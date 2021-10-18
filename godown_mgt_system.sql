-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 18, 2021 at 10:46 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `godown_mgt_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `name` text DEFAULT NULL,
  `username` text DEFAULT NULL,
  `password` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `name`, `username`, `password`) VALUES
(1, 'Admin', 'admin', 'admin123');

-- --------------------------------------------------------

--
-- Table structure for table `cash_voucher`
--

CREATE TABLE `cash_voucher` (
  `cv_number` int(11) NOT NULL,
  `cv_number_manual` text DEFAULT NULL,
  `gp_number` int(11) DEFAULT NULL,
  `party_id` int(11) DEFAULT NULL,
  `cv_date` date DEFAULT NULL,
  `cv_commodity` text DEFAULT NULL,
  `cv_type` text DEFAULT NULL,
  `cv_payment_type` text DEFAULT NULL,
  `cv_advance` text DEFAULT NULL,
  `cv_name` text DEFAULT NULL,
  `cv_contact` text DEFAULT NULL,
  `cv_signature` text DEFAULT NULL,
  `cv_amount` double DEFAULT NULL,
  `cv_currency` text DEFAULT NULL,
  `cv_details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `gate_pass`
--

CREATE TABLE `gate_pass` (
  `gp_number` int(11) NOT NULL,
  `gp_number_manual` text DEFAULT NULL,
  `gp_party_id` int(11) DEFAULT NULL,
  `gp_type` text DEFAULT NULL,
  `gp_date` date DEFAULT NULL,
  `gp_contact` text DEFAULT NULL,
  `gp_total` double DEFAULT NULL,
  `gp_currency` text DEFAULT NULL,
  `gp_payment_type` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `gp_entries`
--

CREATE TABLE `gp_entries` (
  `gp_entry_id` int(11) NOT NULL,
  `gp_number` int(11) DEFAULT NULL,
  `gp_commodity` text DEFAULT NULL,
  `gp_unit` text DEFAULT NULL,
  `gp_quantity` double DEFAULT NULL,
  `gp_buyer_weight` double DEFAULT NULL,
  `gp_unit_amount` double DEFAULT NULL,
  `gp_total_amount` double DEFAULT NULL,
  `gp_details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ledger`
--

CREATE TABLE `ledger` (
  `l_id` int(11) NOT NULL,
  `party_id` int(11) DEFAULT NULL,
  `gp_number` int(11) DEFAULT NULL,
  `gp_number_manual` text DEFAULT NULL,
  `cv_number` int(11) DEFAULT NULL,
  `cv_number_manual` text DEFAULT NULL,
  `l_commodity` text DEFAULT NULL,
  `l_description` text DEFAULT NULL,
  `l_unit` text DEFAULT NULL,
  `l_seller_weight` double DEFAULT NULL,
  `l_buyer_weight` double DEFAULT NULL,
  `l_rate` double DEFAULT NULL,
  `l_type` text DEFAULT NULL,
  `l_debit` double DEFAULT NULL,
  `l_credit` double DEFAULT NULL,
  `l_balance` double DEFAULT NULL,
  `l_currency` text DEFAULT NULL,
  `l_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `party_info`
--

CREATE TABLE `party_info` (
  `party_id` int(11) NOT NULL,
  `party_name` text DEFAULT NULL,
  `party_contact` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `cash_voucher`
--
ALTER TABLE `cash_voucher`
  ADD PRIMARY KEY (`cv_number`),
  ADD KEY `gp_number` (`gp_number`),
  ADD KEY `party_id` (`party_id`);

--
-- Indexes for table `gate_pass`
--
ALTER TABLE `gate_pass`
  ADD PRIMARY KEY (`gp_number`),
  ADD KEY `gp_party_id` (`gp_party_id`);

--
-- Indexes for table `gp_entries`
--
ALTER TABLE `gp_entries`
  ADD PRIMARY KEY (`gp_entry_id`),
  ADD KEY `gp_number` (`gp_number`);

--
-- Indexes for table `ledger`
--
ALTER TABLE `ledger`
  ADD PRIMARY KEY (`l_id`),
  ADD KEY `party_id` (`party_id`),
  ADD KEY `gp_number` (`gp_number`),
  ADD KEY `cv_number` (`cv_number`);

--
-- Indexes for table `party_info`
--
ALTER TABLE `party_info`
  ADD PRIMARY KEY (`party_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cash_voucher`
--
ALTER TABLE `cash_voucher`
  MODIFY `cv_number` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gate_pass`
--
ALTER TABLE `gate_pass`
  MODIFY `gp_number` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gp_entries`
--
ALTER TABLE `gp_entries`
  MODIFY `gp_entry_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ledger`
--
ALTER TABLE `ledger`
  MODIFY `l_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `party_info`
--
ALTER TABLE `party_info`
  MODIFY `party_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cash_voucher`
--
ALTER TABLE `cash_voucher`
  ADD CONSTRAINT `cash_voucher_ibfk_1` FOREIGN KEY (`gp_number`) REFERENCES `gate_pass` (`gp_number`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cash_voucher_ibfk_2` FOREIGN KEY (`party_id`) REFERENCES `party_info` (`party_id`);

--
-- Constraints for table `gate_pass`
--
ALTER TABLE `gate_pass`
  ADD CONSTRAINT `gate_pass_ibfk_1` FOREIGN KEY (`gp_party_id`) REFERENCES `party_info` (`party_id`);

--
-- Constraints for table `gp_entries`
--
ALTER TABLE `gp_entries`
  ADD CONSTRAINT `gp_entries_ibfk_1` FOREIGN KEY (`gp_number`) REFERENCES `gate_pass` (`gp_number`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ledger`
--
ALTER TABLE `ledger`
  ADD CONSTRAINT `ledger_ibfk_1` FOREIGN KEY (`party_id`) REFERENCES `party_info` (`party_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ledger_ibfk_2` FOREIGN KEY (`gp_number`) REFERENCES `gate_pass` (`gp_number`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ledger_ibfk_3` FOREIGN KEY (`cv_number`) REFERENCES `cash_voucher` (`cv_number`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
