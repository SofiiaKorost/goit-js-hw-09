import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
    input: document.querySelector('#datetime-picker'),
    startButton: document.querySelector('button[data-start]'),
    days: document.querySelector('span[data-days]'),
    hours: document.querySelector('span[data-hours]'),
    minutes: document.querySelector('span[data-minutes]'),
    seconds: document.querySelector('span[data-seconds]'),
};

let chooseDate = null;

refs.startButton.setAttribute('disabled', '');

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        if (selectedDates[0].getTime() < Date.now()) {
            Notify.failure('Please choose a date in the future');
            refs.startButton.disabled = true;
            return;
        }

        refs.startButton.setAttribute('disabled', '');
        refs.startButton.removeAttribute('disabled', '');
        chooseDate = selectedDates[0].getTime();
    },
};

flatpickr(refs.input, options);

class Timer {
    constructor({ onTick }) {
        this.intervalId = null;
        this.isActive = false;
        this.onTick = onTick;
    }

    start() {
        if (this.isActive) {
            return;
        }

        this.isActive = true;

        this.intervalId = setInterval(() => {
            const currentDate = Date.now();
            const deltaDate = chooseDate - currentDate;
            const time = this.convertMs(deltaDate);

            this.onTick(time);

            if (deltaDate <= 1000) {
                clearInterval(this.intervalId);
                this.isActive = false;
                refs.startButton.disabled = true;
            }
        }, 1000);
    }

    convertMs(ms) {
        // Number of milliseconds per unit of time
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;


        const days = this.pad(Math.floor(ms / day)); // Remaining days
        const hours = this.pad(Math.floor((ms % day) / hour)); // Remaining hours
        const minutes = this.pad(Math.floor(((ms % day) % hour) / minute)); // Remaining minutes
        const seconds = this.pad(
            Math.floor((((ms % day) % hour) % minute) / second) // Remaining seconds
        );

        return { days, hours, minutes, seconds };
    }

    pad(value) {
        return String(value).padStart(2, '0');
    }
}

const timer = new Timer({ onTick: updateInterface });

function updateInterface({ days, hours, minutes, seconds }) {
    refs.days.textContent = `${days}`;
    refs.hours.textContent = `${hours}`;
    refs.minutes.textContent = `${minutes}`;
    refs.seconds.textContent = `${seconds}`;
}

refs.startButton.addEventListener('click', timer.start.bind(timer));