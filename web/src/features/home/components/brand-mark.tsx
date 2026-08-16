/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { cn } from '@/lib/utils'

interface BrandMarkProps {
  className?: string
}

export function BrandMark(props: BrandMarkProps) {
  return (
    <span
      aria-hidden='true'
      className={cn(
        'relative block size-8 overflow-hidden rounded-[0.65rem] bg-[#24221f] dark:bg-[#f4f0e8]',
        props.className
      )}
    >
      <span className='absolute top-[18%] left-[18%] h-[64%] w-[22%] rounded-full bg-[#ff6b4a]' />
      <span className='absolute top-[18%] right-[18%] h-[28%] w-[38%] rounded-full bg-[#d9ff52]' />
      <span className='absolute right-[18%] bottom-[18%] size-[22%] rounded-full bg-[#f4f0e8] dark:bg-[#24221f]' />
    </span>
  )
}
