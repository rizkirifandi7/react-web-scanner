"use client";

import { useState } from "react";
import {
	Scanner,
	useDevices,
	outline,
	boundingBox,
	centerText,
} from "@yudiel/react-qr-scanner";
import { supabase } from "./utils/supabaseClient";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Home, Calendar, BadgeInfo, Heart } from "lucide-react";

interface UserData {
	nama: string;
	email: string;
	linkuser: string;
	foto: string;
	alamat: string;
	jenis_kelamin: string;
	nomor_anggota: string;
	tanggal_bergabung: string;
	tanggal_lahir: string;
}

export default function ScannerPage() {
	const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
	const [tracker, setTracker] = useState<string>("outline");
	const [pause, setPause] = useState(false);
	const [data, setData] = useState<UserData | null>(null);
	const [error, setError] = useState<string | null>(null);

	const devices = useDevices();

	function getTracker() {
		switch (tracker) {
			case "outline":
				return outline;
			case "boundingBox":
				return boundingBox;
			case "centerText":
				return centerText;
			default:
				return undefined;
		}
	}

	const handleScan = async (text_value: string) => {
		if (pause) return;
		setPause(true);
		setError(null);
		setData(null);
		try {
			const { data, error } = await supabase
				.from("user")
				.select("*")
				.eq("nomor_anggota", text_value)
				.single();

			if (error) {
				console.error("Error fetching data:", error);
				setError("User not found or error fetching data.");
				return;
			}

			setData(data);
			console.log("User data:", data);
		} catch (err) {
			console.error("Unexpected error:", err);
			setError("An unexpected error occurred.");
		} finally {
			setTimeout(() => setPause(false), 1000);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-dvh bg-gray-100 dark:bg-gray-900 p-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-8 max-w-6xl w-full">
				<Card>
					<CardHeader className="border-b">
						<CardTitle>QR Code Scanner</CardTitle>
						<CardDescription>
							Pilih perangkat kamera dan mode pelacak.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<Select onValueChange={setDeviceId}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select a device" />
									</SelectTrigger>
									<SelectContent>
										{devices.map((device) => (
											<SelectItem key={device.deviceId} value={device.deviceId}>
												{device.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select onValueChange={setTracker} defaultValue="centerText">
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select tracker" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="centerText">Center Text</SelectItem>
										<SelectItem value="outline">Outline</SelectItem>
										<SelectItem value="boundingBox">Bounding Box</SelectItem>
										<SelectItem value="none">No Tracker</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="rounded-lg overflow-hidden">
								<Scanner
									formats={[
										"qr_code",
										"micro_qr_code",
										"rm_qr_code",
										"maxi_code",
										"pdf417",
										"aztec",
										"data_matrix",
										"matrix_codes",
										"dx_film_edge",
										"databar",
										"databar_expanded",
										"codabar",
										"code_39",
										"code_93",
										"code_128",
										"ean_8",
										"ean_13",
										"itf",
										"linear_codes",
										"upc_a",
										"upc_e",
									]}
									constraints={{
										deviceId: deviceId,
									}}
									onScan={(detectedCodes) => {
										if (detectedCodes.length > 0) {
											handleScan(detectedCodes[0].rawValue);
										}
									}}
									onError={(error) => {
										console.log(`onError: ${error?.message}`);
									}}
									components={{
										onOff: true,
										torch: true,
										zoom: true,
										finder: true,
										tracker: getTracker(),
									}}
									allowMultiple={false}
									scanDelay={1000}
									paused={pause}
								/>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="border-b">
						<CardTitle>Scanned Data</CardTitle>
						<CardDescription>
							Menampilkan informasi user setelah pemindaian berhasil.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex items-center justify-center h-full p-6">
						<div className="text-center w-full">
							{error && <p className="text-red-500">{error}</p>}
							{data ? (
								<div className="flex flex-col items-center text-center space-y-4">
									<Avatar className="w-24 h-24 border">
										<AvatarImage
											src={
												data.foto ||
												`https://avatar.vercel.sh/${data.email}.png`
											}
											alt={data.nama}
										/>
										<AvatarFallback>
											{data.nama.substring(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="space-y-1">
										<h3 className="text-2xl font-bold">{data.nama}</h3>
										<p className="text-gray-500 dark:text-gray-400">
											{data.email}
										</p>
									</div>
									<div className="w-full pt-4 border-t mt-4 text-left space-y-3">
										<div className="flex items-center gap-3">
											<BadgeInfo className="w-5 h-5 text-gray-500" />
											<span className="font-semibold">Nomor Anggota:</span>
											<span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-sm">
												{data.nomor_anggota}
											</span>
										</div>
										<div className="flex items-center gap-3">
											<Home className="w-5 h-5 text-gray-500" />
											<span className="font-semibold">Alamat:</span>
											<span>{data.alamat}</span>
										</div>
										<div className="flex items-center gap-3">
											<Heart className="w-5 h-5 text-gray-500" />
											<span className="font-semibold">Jenis Kelamin:</span>
											<span>{data.jenis_kelamin}</span>
										</div>
										<div className="flex items-center gap-3">
											<Calendar className="w-5 h-5 text-gray-500" />
											<span className="font-semibold">Tanggal Lahir:</span>
											<span>{data.tanggal_lahir}</span>
										</div>
										<div className="flex items-center gap-3">
											<Calendar className="w-5 h-5 text-gray-500" />
											<span className="font-semibold">Bergabung Sejak:</span>
											<span>{data.tanggal_bergabung}</span>
										</div>
									</div>
								</div>
							) : (
								<div className="flex flex-col items-center justify-center space-y-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="48"
										height="48"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-gray-400"
									>
										<path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
									</svg>
									<p className="text-gray-500">
										Scan a QR code to display user data.
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

