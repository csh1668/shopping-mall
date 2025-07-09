class Logger {
	private name: string;

	private constructor(name: string) {
		this.name = name;
	}

	static create(name: string) {
		return new Logger(name);
	}

	private getTimestamp() {
		const now = new Date();
		return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
	}

	log(message: string, ...optionalParams: any[]) {
		const timestamp = this.getTimestamp();
		console.log(
			`[${timestamp}]\t[${this.name}]\t${message}`,
			...optionalParams,
		);
	}

	info(message: string, ...optionalParams: any[]) {
		const timestamp = this.getTimestamp();
		// 파란색
		console.info(
			`[${timestamp}]\t%c[${this.name}]\t%c${message}`,
			"color: #2ecc40; font-weight: bold;",
			"color: #2ecc40;",
			...optionalParams,
		);
	}

	warn(message: string, ...optionalParams: any[]) {
		const timestamp = this.getTimestamp();
		// 주황색
		console.warn(
			`[${timestamp}]\t%c[${this.name}]\t%c${message}`,
			"color: #e67e22; font-weight: bold;",
			"color: #e67e22;",
			...optionalParams,
		);
	}

	error(message: string, ...optionalParams: any[]) {
		const timestamp = this.getTimestamp();
		// 빨간색
		console.error(
			`[${timestamp}]\t%c[${this.name}]\t%c${message}`,
			"color: #e74c3c; font-weight: bold;",
			"color: #e74c3c;",
			...optionalParams,
		);
	}
}

export const createLogger = (name: string) => Logger.create(name);
